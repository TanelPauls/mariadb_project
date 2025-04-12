import tableOperations from "../db/tableOperations.js";
import CreateTables from "../db/initTables.js";
import fetchAndInsert from "../db/loadDataURLLiik.js";
import fetchAndInsertTootja from "../db/loadDataURLTootja.js";
import fetchAndInsertTooted from "../db/loadDataURLTooted.js";

export const resetDB = async (req, res) => {
  try {
    await tableOperations.dropTableTOOTED();
    await tableOperations.dropTableLIIK();
    await tableOperations.dropTableTOOTJA();
    await CreateTables.createTableTOOTJA();
    await CreateTables.createTableLIIK();
    await CreateTables.createTableTOOTED();
    await fetchAndInsert();
    await fetchAndInsertTootja();
    await fetchAndInsertTooted();

    res.status(200).json({ message: "Databaas edukalt resetitud." });
  } catch (error) {
    console.error("Error in resetDB controller:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const unSorted = async (req, res) => {
  try {
    const sortedProducts = await tableOperations.unSorted();
    return res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const sortUp = async (req, res) => {
  try {
    const sortedProducts = await tableOperations.sortUp();
    return res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const sortDown = async (req, res) => {
  try {
    const sortedProducts = await tableOperations.sortDown();
    return res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const priceKG = async (req, res) => {
  try {
    const pricePerKG = await tableOperations.priceKG();
    return res.status(200).json(pricePerKG);
  } catch (error) {
    console.error("Error kilohinnaga:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const priceKGSortUp = async (req, res) => {
  try {
    const pricePerKGSortUp = await tableOperations.priceKGsortUp();
    return res.status(200).json(pricePerKGSortUp);
  } catch (error) {
    console.error("Error kilohinna sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const priceKGSortDown = async (req, res) => {
  try {
    const pricePerKGsortdown = await tableOperations.priceKGsortDown();
    return res.status(200).json(pricePerKGsortdown);
  } catch (error) {
    console.error("Error kilohinna sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const search = async (req, res) => {
  let { name, price } = req.query;

  name = name ?? "";
  price = parseFloat(price ?? "0");

  if (isNaN(price)) {
    return res.status(400).json({ message: "Invalid price value." });
  }

  price = parseFloat(price);
  try {
    const results = await tableOperations.search(name, price);
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error otsingul:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { Nimetus, Kaal, Hind } = req.body;

  if (!Nimetus && !Kaal && !Hind) {
    return res
      .status(400)
      .json({ message: "Vähemalt üks väli peab olema esitatud." });
  }

  try {
    const result = await tableOperations.updateProduct(id, {
      Nimetus,
      Kaal,
      Hind,
    });
    return res.status(200).json({
      message: "Muudatused tehtud.",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error muudatuste tegemisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const namePriceVariety = async (req, res) => {
  try {
    const result = await tableOperations.namePriceVariety();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const namePriceVarietyCompany = async (req, res) => {
  try {
    const result = await tableOperations.namePriceVarietyCompany();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const breads = async (req, res) => {
  try {
    const result = await tableOperations.breads();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const addDiscount = async (req, res) => {
  try {
    const result = await tableOperations.helper();
    if (result[0].Count === 0) {
      await tableOperations.addDiscount();
      return res
        .status(200)
        .json([{ Teade: "Allahindluse väli edukalt lisatud." }]);
    } else {
      return res
        .status(200)
        .json([{ Teade: "Allahindluse väli on juba olemas." }]);
    }
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const applyDiscount = async (req, res) => {
  const { name, value } = req.body;

  if (!name || typeof value !== "number") {
    return res
      .status(400)
      .json({ message: "Sisesta otsisõna ja allahindluse väärtus." });
  }

  try {
    const result = await tableOperations.applyDiscount(name, value);
    res.status(200).json({
      message: `Allahindlus ${value}% rakendatud toodetele, mille nimetus sisaldab "${name}".`,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error allahindluse määramisel:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const allDiscounts = async (req, res) => {
  try {
    const check = await tableOperations.helper(); // checks if Allahindlus exists

    if (check[0].Count === 0) {
      return res.status(200).json([
        {
          Teade:
            "Allahindluse veerg puudub. Lisa see enne, kui proovid allahindlusi vaadata.",
        },
      ]);
    }

    const result = await tableOperations.allDiscounts();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const oldDiscounts = async (req, res) => {
  try {
    const check = await tableOperations.helper(); // checks if Allahindlus exists

    if (check[0].Count === 0) {
      return res.status(200).json([
        {
          Teade:
            "Allahindluse veerg puudub. Lisa see enne, kui proovid allahindlusi vaadata.",
        },
      ]);
    }

    const result = await tableOperations.oldDiscounts();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const cheapest = async (req, res) => {
  try {
    const result = await tableOperations.cheapest();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const mostexpensive = async (req, res) => {
  try {
    const result = await tableOperations.mostexpensive();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const loadEdit = async (req, res) => {
  try {
    const result = await tableOperations.loadEdit();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sorteerimisel:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
