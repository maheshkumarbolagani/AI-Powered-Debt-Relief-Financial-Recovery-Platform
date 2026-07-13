import Sidebar from "./Sidebar";

function Layout({ children }) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#121212"
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    padding: "30px",
                    color: "white"
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default Layout;