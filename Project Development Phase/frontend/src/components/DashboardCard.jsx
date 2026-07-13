function DashboardCard({ title, value }) {
    return (
        <div
            style={{
                background: "#1e1e1e",
                padding: "20px",
                borderRadius: "12px",
                minWidth: "220px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                color: "white",
                textAlign: "center"
            }}
        >
            <h3
                style={{
                    marginBottom: "15px",
                    color: "#ffffff"
                }}
            >
                {title}
            </h3>

            <h2
                style={{
                    color: "#4CAF50",
                    margin: 0
                }}
            >
                {value}
            </h2>
        </div>
    );
}

export default DashboardCard;