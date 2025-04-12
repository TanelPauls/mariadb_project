import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";

const endpoints = [
  {
    label:
      "1. Kuvada toodete nimetused, kaalud ja hinnad ning järjestada tooted hinna järgi kahanevalt.",
    value: "/unsorted",
  },
  {
    label:
      "2. Kuvada toodete nimetused, kaalud, hinnad ning toote ühe kilogrammi hind.",
    value: "/pricePerKG",
  },
  {
    label:
      "3. Kuvada kõik tooted, mille nimetus sisaldab sõna leib ja mis maksab üle 2 euro. Lisaks toote nimetusele väljasta ka kaal ja hind.",
    value: "/search#leib",
  },
  {
    label:
      "4. Veebirakenduses on võimalik muuta toodete andmeid. Kirjuta käsk, mis muudab toote “Teratasku” hinda, uus hind 1.35€.",
    value: "/edit/:id",
  },
  {
    label: "5. Kuva toote nimetus, hind ja toote liigi nimetus.",
    value: "/namePriceVariety",
  },
  {
    label:
      "6. Kuva toote nimetus, hind ja toote liigi nimetus ning tootja nimi.",
    value: "/namePriceVarietyCompany",
  },
  {
    label: "7. Kuva mitu saia ja mitu leiba on toodete seas?",
    value: "/breads",
  },
  {
    label: "8. Kuva toote nimetused, mis sisaldavad sõna “seemne”.",
    value: "/search#seemne",
  },
  {
    label:
      "9. Andmebaasi haldurile anti ülesanne lisada toodete tabelisse uus väli Allahindlus. Allahindlusi hoitakse täisarvudena. Millise käsuga saab selle muudatuse teha?",
    value: "/addDiscount",
  },
  {
    label:
      "10. Kõikidele toodete, mis on viilutatud lisada allahindluse protsent 5 ja kõikidele röstitavatele toodetele allahindluse protsent 10.",
    value: "/applyDiscount",
  },
  {
    label:
      "11. Kuva allahinnatud toodete nimed, vana hind ja uus hind etteantud allahindlusega.",
    value: "/allDiscounts",
  },
  {
    label: "12. Kuva kõige odavam sai ja leib koos nimetuse ning hinnaga.",
    value: "/cheapest",
  },
  {
    label: "13. Kuva 3 kõige kallimat leiba ja 3 kõige kallimat saia.",
    value: "/mostexpensive",
  },
];

export default function ProductViewer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("/unsorted");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [editField, setEditField] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [hasDiscountColumn, setHasDiscountColumn] = useState(true);

  useEffect(() => {
    const [baseEndpoint, tag] = selectedEndpoint.split("#");

    if (baseEndpoint === "/search") {
      setSearchName("");
      setSearchPrice("");
      fetchData(`/search?name=&price=0`);
    } else if (selectedEndpoint.startsWith("/edit")) {
      fetchData("/edit");
    } else if (selectedEndpoint === "/applyDiscount") {
      fetchData(`/oldDiscounts`);
    } else {
      fetchData(selectedEndpoint.replace("/:id", ""));
    }
  }, [selectedEndpoint]);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
      const json = await res.json();

      if (
        Array.isArray(json) &&
        json.length === 1 &&
        json[0].Teade?.includes("Allahindluse veerg puudub")
      ) {
        setHasDiscountColumn(false);
      } else {
        setHasDiscountColumn(true);
      }

      setData(json);
    } catch (err) {
      setError("Viga andmete laadimisel.");
      setData([]);
      setHasDiscountColumn(false);
    } finally {
      setLoading(false);
    }
  };

  const sendUpdate = async (id, key, value) => {
    console.log("Sending update:", { id, key, value });

    if (!id || value === undefined) {
      console.warn("Missing ID or value");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      const json = await res.json();
      console.log("Server response:", json);
      setEditField(null);
      fetchData("/edit");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleSortDirection = (direction) => {
    if (!selectedEndpoint) return;
    const base = selectedEndpoint.replace("/", "");
    let newEndpoint = "";

    if (["unsorted", "sortup", "sortdown"].includes(base)) {
      newEndpoint = direction === "up" ? "/sortup" : "/sortdown";
    } else if (
      ["pricePerKG", "pricePerKGsortUp", "pricePerKGsortDown"].includes(base)
    ) {
      newEndpoint =
        direction === "up" ? "/pricePerKGsortUp" : "/pricePerKGsortDown";
    } else {
      newEndpoint = "/unsorted";
    }

    fetchData(newEndpoint);
  };

  const sortableColumnsByEndpoint = {
    unsorted: "Hind",
    sortup: "Hind",
    sortdown: "Hind",
    pricePerKG: "Kilo_hind",
    pricePerKGsortUp: "Kilo_hind",
    pricePerKGsortDown: "Kilo_hind",
  };

  const renderTable = () => {
    if (data.length === 0) return <p>Andmeid ei leitud.</p>;

    const headers = Object.keys(data[0] || {}).filter((key) => key !== "id");

    return (
      <table
        style={{ borderCollapse: "collapse", marginTop: 20, width: "100%" }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>
                {h}
                {sortableColumnsByEndpoint[
                  selectedEndpoint.replace("/", "")
                ] === h && (
                  <>
                    <FaArrowUp
                      style={{ marginLeft: 5, cursor: "pointer", color: "red" }}
                      onClick={() => handleSortDirection("up")}
                    />
                    <FaArrowDown
                      style={{ marginLeft: 5, cursor: "pointer", color: "red" }}
                      onClick={() => handleSortDirection("down")}
                    />
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((key) => {
                const isEditing =
                  editField?.row === i && editField?.field === key;
                return (
                  <td
                    key={key}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {selectedEndpoint.startsWith("/edit") ? (
                      isEditing ? (
                        <>
                          <input
                            type={
                              typeof row[key] === "number" ? "number" : "text"
                            }
                            value={editedRow[key]}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                [key]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                sendUpdate(row.id, key, editedRow[key]);
                              }
                            }}
                            style={{ marginRight: 4 }}
                            autoFocus
                          />
                          <button
                            onClick={() =>
                              sendUpdate(row.id, key, editedRow[key])
                            }
                            style={{ padding: "2px 6px" }}
                          >
                            ✅
                          </button>
                        </>
                      ) : (
                        <>
                          {row[key]}{" "}
                          <FaEdit
                            style={{
                              marginLeft: 5,
                              cursor: "pointer",
                              color: "blue",
                            }}
                            onClick={() => {
                              setEditField({ row: i, field: key });
                              setEditedRow(row);
                            }}
                          />
                        </>
                      )
                    ) : (
                      row[key]
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Vali andmed</h2>
        <button
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onClick={async () => {
            const confirmed = window.confirm(
              "Kas oled kindel, et soovid kogu andmebaasi resettida? See tegevus on pöördumatu."
            );
            if (confirmed) {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_BASE_URL}/reset`
                );
                const json = await res.json();
                alert(json.message || "Andmebaas resetitud.");
                window.location.reload(); // optional: refresh view
              } catch (err) {
                console.error("Reset failed:", err);
                alert("Andmebaasi reset ebaõnnestus.");
              }
            }
          }}
        >
          Reseti kogu andmebaas.
        </button>
      </div>

      <select
        value={selectedEndpoint}
        onChange={(e) => setSelectedEndpoint(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", minWidth: "250px" }}
      >
        {endpoints.map((ep) => (
          <option key={ep.value} value={ep.value}>
            {ep.label}
          </option>
        ))}
      </select>

      {selectedEndpoint.startsWith("/search") && (
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Nimetus sisaldab...
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ marginRight: 10, padding: "6px", width: "250px" }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Hind üle...
            </label>
            <input
              type="number"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              style={{ marginRight: 10, padding: "6px", width: "250px" }}
            />
          </div>

          <button
            onClick={() =>
              fetchData(`/search?name=${searchName}&price=${searchPrice || 0}`)
            }
            style={{ padding: "6px 12px" }}
          >
            Otsi
          </button>
        </div>
      )}

      {selectedEndpoint === "/applyDiscount" && hasDiscountColumn && (
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Tootenimetus sisaldab...
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ marginRight: 10, padding: "6px", width: "250px" }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              Allahindlus (%)
            </label>
            <input
              type="number"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              style={{ marginRight: 10, padding: "6px", width: "250px" }}
            />
          </div>

          <button
            onClick={async () => {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_BASE_URL}/applyDiscount`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: searchName,
                      value: parseInt(searchPrice, 10),
                    }),
                  }
                );
                const json = await res.json();
                alert(json.message);
                fetchData("/oldDiscounts");
              } catch (err) {
                console.error("Apply discount failed:", err);
                alert("Midagi läks valesti allahindluse lisamisel.");
              }
            }}
            style={{ padding: "6px 12px" }}
          >
            Lisa allahindlus
          </button>
        </div>
      )}

      {loading && <p>Laen andmeid...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {renderTable()}
    </div>
  );
}
