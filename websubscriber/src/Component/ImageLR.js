import React, { useEffect, useState } from "react";

function getImageMime(format) {
    const normalized = String(format || "").toLowerCase();

    if (normalized.includes("png")) return "image/png";
    if (normalized.includes("bmp")) return "image/bmp";
    if (normalized.includes("webp")) return "image/webp";
    return "image/jpeg";
}

export default function ImageLR({ data }) {
    const [imgSrc, setImgSrc] = useState("");

    useEffect(() => {
        if (!data?.data) {
            setImgSrc("");
            return;
        }

        if (typeof data.data === "string") {
            setImgSrc(`data:${getImageMime(data.format)};base64,${data.data}`);
            return;
        }

        if (Array.isArray(data.data)) {
            const byteArray = new Uint8Array(data.data);
            const blob = new Blob([byteArray], { type: getImageMime(data.format) });
            const objectUrl = URL.createObjectURL(blob);
            setImgSrc(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

        setImgSrc("");
    }, [data]);

    if (!imgSrc) {
        return <p>Waiting for image...</p>;
    }

    return (
        <img
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            src={imgSrc}
            alt="camera"
        />
    );
}
