export default function RawMessageComponent({ data }) {
    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Waiting for messages...</p>
            )}
        </div>
    );
}