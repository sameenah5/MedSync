// vc.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/button";
import { Loader2, Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPublisherReady, setIsPublisherReady] = useState(false);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);
  const router = useRouter();
  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    try {
      sessionRef.current = window.OT.initSession(appId, sessionId);

      sessionRef.current.on("streamCreated", (event) => {
        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) toast.error("Error connecting to other participant");
          }
        );
      });

      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);
        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
          },
          (error) => {
            if (error) toast.error("Error initializing camera/mic");
            else setIsPublisherReady(true);
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => setIsConnected(false));

      sessionRef.current.connect(token, (error) => {
        if (!error && publisherRef.current) {
          sessionRef.current.publish(publisherRef.current);
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  const endCall = () => {
    if (publisherRef.current) publisherRef.current.destroy();
    if (sessionRef.current) sessionRef.current.disconnect();
    router.push("/appointments");
  };

  useEffect(() => {
    return () => {
      if (publisherRef.current) publisherRef.current.destroy();
      if (sessionRef.current) sessionRef.current.disconnect();
    };
  }, []);

  if (!sessionId || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Invalid Video Call</h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button onClick={() => router.push("/appointments")}>Back to Appointments</Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video script");
          setIsLoading(false);
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Video Consultation</h1>
          <p className="text-muted-foreground">
            {isConnected ? "Connected" : isLoading ? "Connecting..." : "Connection failed"}
          </p>
        </div>

        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p>Loading video...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Your Video */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="p-2 text-sm">You</div>
                <div
                  id="publisher"
                  className="w-full aspect-video bg-muted"
                  style={{ maxHeight: "60vh" }}
                />
              </div>

              {/* Other User */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="p-2 text-sm">Other Participant</div>
                <div
                  id="subscriber"
                  className="w-full aspect-video bg-muted"
                  style={{ maxHeight: "60vh" }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button onClick={toggleVideo} disabled={!isPublisherReady}>
                {isVideoEnabled ? <Video /> : <VideoOff />}
              </Button>

              <Button onClick={toggleAudio} disabled={!isPublisherReady}>
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </Button>

              <Button onClick={endCall} variant="destructive">
                <PhoneOff />
              </Button>
            </div>

            <p className="text-center text-sm">
              {isVideoEnabled ? "Camera on" : "Camera off"} • {isAudioEnabled ? "Mic on" : "Mic off"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}