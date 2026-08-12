// 고빈도 바이너리 스트림(포인트 클라우드 등)을 React state를 거치지 않고
// 뷰어에 직접 전달하기 위한 초경량 pub/sub 버스.
//
// React의 렌더 사이클 밖(모듈 레벨)에서 동작하므로,
// 프레임이 와도 setState/리렌더가 발생하지 않는다.

const subscribers = new Map(); // topicKey -> Set<callback>

const makeKey = (vehicleId, topic) => `${vehicleId}::${topic}`;

export function subscribeBinary(vehicleId, topic, cb) {
    const key = makeKey(vehicleId, topic);
    if (!subscribers.has(key)) {
        subscribers.set(key, new Set());
    }
    subscribers.get(key).add(cb);

    // 구독 해제 함수 반환
    return () => {
        const set = subscribers.get(key);
        if (!set) return;
        set.delete(cb);
        if (set.size === 0) {
            subscribers.delete(key);
        }
    };
}

export function publishBinary(vehicleId, topic, value) {
    const set = subscribers.get(makeKey(vehicleId, topic));
    if (!set || set.size === 0) return false;

    for (const cb of set) {
        try {
            cb(value);
        } catch (e) {
            console.warn("binary subscriber callback error", e);
        }
    }
    return true;
}
