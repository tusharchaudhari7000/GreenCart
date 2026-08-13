import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../services/adminService";

function ManageAccounts() {
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const farmersData = await adminService.getFarmers();
      const buyersData = await adminService.getBuyers();
      setFarmers(farmersData);
      setBuyers(buyersData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveFarmer(id);
      fetchData();
    } catch (error) {
      toast.error("Failed to approve farmer");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await adminService.suspendUser(id);
      fetchData();
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-accounts-section">
      <div className="section-header">
        <h2>👥 User Account Management</h2>
      </div>

      <div className="account-category">
        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1b5e20", marginBottom: "1.5rem" }}>
          <span>👨‍🌾</span> Farmer Accounts (Review & Moderate)
        </h3>
        <div className="admin-card-grid">
          {farmers.map(f => (
            <div key={f.userId} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span className={`status-badge ${f.status === 1 ? "approved" : f.status === 2 ? "pending" : "suspended"}`}>
                  {f.status === 1 ? "ACTIVE" : f.status === 2 ? "PENDING" : "SUSPENDED"}
                </span>
                <span style={{ color: "#aaa", fontSize: "0.75rem" }}>FARMER-#{f.userId}</span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", color: "#333", fontSize: "1.1rem" }}>{f.firstName} {f.lastName}</h4>
              <p style={{ margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.85rem" }}>{f.email}</p>
              {f.aadhaarNo && (
                <p style={{ margin: "0 0 0.5rem 0", color: "#1b5e20", fontSize: "0.85rem", fontWeight: "500" }}>
                  📇 Aadhar: {f.aadhaarNo}
                </p>
              )}
              <p style={{ margin: "0 0 1.5rem 0", color: "#999", fontSize: "0.8rem" }}>Joined: {new Date(f.createdAt).toLocaleDateString()}</p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {f.status === 2 ? (
                  <button className="admin-btn admin-btn-primary" style={{ flex: 1 }} onClick={() => handleApprove(f.userId)}>Approve Account</button>
                ) : (
                  <button className="admin-btn admin-btn-outline" style={{ flex: 1, pointerEvents: "none", opacity: 0.6 }}>
                    {f.status === 1 ? "Approved" : "Suspended"}
                  </button>
                )}
                {f.status !== 3 && (
                  <button className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={() => handleSuspend(f.userId)}>Suspend</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="account-category" style={{ marginTop: "4rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1b5e20", marginBottom: "0.5rem" }}>
          <span>🛒</span> Buyer Accounts (Security Only)
        </h3>
        <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Administrator oversight for buyer profiles is limited to account suspension.</p>
        <div className="admin-card-grid">
          {buyers.map(b => (
            <div key={b.userId} className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span className={`status-badge ${b.status === 3 ? "suspended" : "approved"}`}>
                  {b.status === 3 ? "Suspended" : "Active"}
                </span>
                <span style={{ color: "#aaa", fontSize: "0.75rem" }}>BUYER-#{b.userId}</span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", color: "#333", fontSize: "1.1rem" }}>{b.firstName} {b.lastName}</h4>
              <p style={{ margin: "0 0 1.25rem 0", color: "#666", fontSize: "0.85rem" }}>{b.email}</p>

              {b.status !== 3 && (
                <button
                  className="admin-btn admin-btn-danger"
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  onClick={() => handleSuspend(b.userId)}
                >
                  Suspend Buyer Account
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default ManageAccounts;
