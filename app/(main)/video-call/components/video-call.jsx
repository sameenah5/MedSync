"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // ✅ NEW STATE (fix for ref error)
  const [isPublisherReady, setIsPublisherReady] = useState(false);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);

  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  // Handle script load
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  // Initialize video session
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    try {
      // Initialize session
      sessionRef.current = window.OT.initSession(appId, sessionId);

      // Subscribe to streams
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
            if (error) {
              toast.error("Error connecting to other participant");
            }
          }
        );
      });

      // Session connected
      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);

        // ✅ Initialize publisher AFTER connection
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
            if (error) {
              toast.error("Error initializing camera/mic");
            } else {
              setIsPublisherReady(true); // ✅ IMPORTANT FIX
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      // Connect session
      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to session");
        } else {
          if (publisherRef.current) {
            sessionRef.current.publish(publisherRef.current);
          }
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // End call
  const endCall = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }

    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    router.push("/appointments");
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  // Invalid params UI
  if (!sessionId || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Invalid Video Call
        </h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button onClick={() => router.push("/appointments")}>
          Back to Appointments
        </Button>
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Video Consultation
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? "Connected"
              : isLoading
              ? "Connecting..."
              : "Connection failed"}
          </p>
        </div>

        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p>Loading video...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Your Video */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-2 text-sm">You</div>
                <div id="publisher" className="h-[350px] bg-muted" />
              </div>

              {/* Other User */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-2 text-sm">Other Participant</div>
                <div id="subscriber" className="h-[350px] bg-muted" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleVideo}
                disabled={!isPublisherReady} // ✅ FIXED
              >
                {isVideoEnabled ? <Video /> : <VideoOff />}
              </Button>

              <Button
                onClick={toggleAudio}
                disabled={!isPublisherReady} // ✅ FIXED
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </Button>

              <Button onClick={endCall} variant="destructive">
                <PhoneOff />
              </Button>
            </div>

            <p className="text-center text-sm">
              {isVideoEnabled ? "Camera on" : "Camera off"} •{" "}
              {isAudioEnabled ? "Mic on" : "Mic off"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}