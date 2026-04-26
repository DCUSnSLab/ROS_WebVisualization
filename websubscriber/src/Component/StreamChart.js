import React, { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const MAX_POINTS = 30;
const MAX_SERIES = 3;

function flattenNumericFields(value, prefix = "") {
    if (value == null) return [];

    if (typeof value === "number" && Number.isFinite(value)) {
        return [{ key: prefix || "value", value }];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item, index) =>
            flattenNumericFields(item, `${prefix}[${index}]`)
        );
    }

    if (typeof value === "object") {
        return Object.entries(value).flatMap(([key, nestedValue]) => {
            const nextPrefix = prefix ? `${prefix}.${key}` : key;
            return flattenNumericFields(nestedValue, nextPrefix);
        });
    }

    return [];
}

function pickSeries(fields) {
    const priorities = [
        "pose.pose.position.x",
        "pose.pose.position.y",
        "pose.pose.position.z",
        "twist.twist.linear.x",
        "twist.twist.linear.y",
        "twist.twist.linear.z",
        "pose.position.x",
        "pose.position.y",
        "pose.position.z",
        "position.x",
        "position.y",
        "position.z",
        "lat",
        "lon",
        "altitude",
        "x",
        "y",
        "z",
    ];

    const byKey = new Map(fields.map((field) => [field.key, field]));
    const selected = [];

    for (const key of priorities) {
        if (byKey.has(key)) {
            selected.push(byKey.get(key));
        }
        if (selected.length >= MAX_SERIES) break;
    }

    if (selected.length > 0) {
        return selected.slice(0, MAX_SERIES);
    }

    return fields.slice(0, MAX_SERIES);
}

function buildPalette(index) {
    const palette = [
        {
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
        {
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
        {
            borderColor: "rgb(255, 205, 86)",
            backgroundColor: "rgba(255, 205, 86, 0.2)",
        },
    ];

    return palette[index % palette.length];
}

export default function Stream({ data }) {
    const [seriesKeys, setSeriesKeys] = useState([]);
    const [history, setHistory] = useState([]);
    const seriesKeysRef = useRef([]);

    useEffect(() => {
        const numericFields = flattenNumericFields(data);
        if (numericFields.length === 0) return;

        const selectedFields = pickSeries(numericFields);
        const nextKeys = selectedFields.map((field) => field.key);
        const nextEntry = Object.fromEntries(
            selectedFields.map((field) => [field.key, field.value])
        );
        const prevKeys = seriesKeysRef.current;
        const keysChanged =
            prevKeys.length !== nextKeys.length ||
            prevKeys.some((key, index) => key !== nextKeys[index]);

        if (keysChanged) {
            seriesKeysRef.current = nextKeys;
            setSeriesKeys(nextKeys);
            setHistory([nextEntry]);
            return;
        }

        setHistory((prevHistory) => {
            const nextHistory = [...prevHistory, nextEntry];
            if (nextHistory.length > MAX_POINTS) {
                nextHistory.shift();
            }
            return nextHistory;
        });
    }, [data]);

    const labels = useMemo(
        () => history.map((_, index) => `${index + 1}`),
        [history]
    );

    const datasets = useMemo(
        () =>
            seriesKeys.map((key, index) => {
                const palette = buildPalette(index);
                return {
                    label: key,
                    data: history.map((entry) => entry[key] ?? null),
                    borderColor: palette.borderColor,
                    backgroundColor: palette.backgroundColor,
                    fill: false,
                    cubicInterpolationMode: "monotone",
                    tension: 0.2,
                    pointRadius: 3,
                    pointHoverRadius: 4,
                    spanGaps: true,
                };
            }),
        [history, seriesKeys]
    );

    if (datasets.length === 0) {
        return <p>Waiting for numeric plot data...</p>;
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Line
                data={{ labels, datasets }}
                options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    animation: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Sample",
                            },
                        },
                        y: {
                            grace: "5%",
                        },
                    },
                }}
            />
        </div>
    );
}
