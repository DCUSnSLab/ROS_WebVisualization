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

        // 릴레이 바이너리 프레임: 압축 이미지 바이트가 그대로 옴
        if (data.data instanceof Uint8Array || data.data instanceof ArrayBuffer) {
            const blob = new Blob([data.data], { type: getImageMime(data.format) });
            const objectUrl = URL.createObjectURL(blob);
            setImgSrc(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
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
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <img
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
                src={imgSrc}
                alt="camera"
            />
        </div>
    );
}
