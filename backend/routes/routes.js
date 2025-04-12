import express from "express";

import {
  resetDB,
  unSorted,
  sortUp,
  sortDown,
  priceKG,
  priceKGSortUp,
  priceKGSortDown,
  search,
  loadEdit,
  updateProduct,
  namePriceVariety,
  namePriceVarietyCompany,
  breads,
  addDiscount,
  applyDiscount,
  allDiscounts,
  oldDiscounts,
  cheapest,
  mostexpensive,
} from "../controllers/db.controllers.js";

const router = express.Router();

router.get("/reset", resetDB);
router.get("/unSorted", unSorted);
router.get("/sortUp", sortUp);
router.get("/sortDown", sortDown);
router.get("/pricePerKG", priceKG);
router.get("/pricePerKGsortUp", priceKGSortUp);
router.get("/pricePerKGsortDown", priceKGSortDown);
router.get("/search", search);
router.get("/edit", loadEdit);
router.patch("/edit/:id", updateProduct);
router.get("/namePriceVariety", namePriceVariety);
router.get("/namePriceVarietyCompany", namePriceVarietyCompany);
router.get("/breads", breads);
router.get("/addDiscount", addDiscount);
router.patch("/applyDiscount", applyDiscount);
router.get("/allDiscounts", allDiscounts);
router.get("/oldDiscounts", oldDiscounts);
router.get("/cheapest", cheapest);
router.get("/mostexpensive", mostexpensive);

export default router;
