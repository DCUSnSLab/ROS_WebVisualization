// App.jsx
import { Outlet } from "react-router-dom";
import "./index.css"; // 공통 CSS 여기서 import (또는 개별 컴포넌트에서)

export default function App() {
    return (
        <div>
            <Outlet />
        </div>
    );
}
