import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { getDb } from "./firebase"

function normalizeDoc(id, data) {
  const out = { id, ...data }
  // Convert Firestore Timestamp -> ISO string to match pages' new Date(...)
  if (out.created_date && typeof out.created_date?.toDate === "function") {
    out.created_date = out.created_date.toDate().toISOString()
  }
  if (out.paid_at && typeof out.paid_at?.toDate === "function") {
    out.paid_at = out.paid_at.toDate().toISOString()
  }
  return out
}

function parseSort(sort) {
  if (!sort) return null
  const isDesc = sort.startsWith("-")
  const field = isDesc ? sort.slice(1) : sort
  return { field, direction: isDesc ? "desc" : "asc" }
}

function makeEntity(collectionName) {
  return {
    async create(data) {
      const db = getDb()
      const ref = await addDoc(collection(db, collectionName), {
        ...data,
        created_date: serverTimestamp(),
      })
      return { id: ref.id, ...data }
    },

    async update(id, data) {
      const db = getDb()
      await updateDoc(doc(db, collectionName, id), data)
      return { id, ...data }
    },

    async list(sort) {
      const db = getDb()
      const s = parseSort(sort) || { field: "created_date", direction: "desc" }
      const q = query(collection(db, collectionName), orderBy(s.field, s.direction))
      const snap = await getDocs(q)
      return snap.docs.map((d) => normalizeDoc(d.id, d.data()))
    },

    async filter(filters = {}, sort) {
      const db = getDb()
      const clauses = []
      for (const [k, v] of Object.entries(filters)) {
        clauses.push(where(k, "==", v))
      }
      const s = parseSort(sort)
      const q = query(
        collection(db, collectionName),
        ...clauses,
        ...(s ? [orderBy(s.field, s.direction)] : []),
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => normalizeDoc(d.id, d.data()))
    },
  }
}

export const base44 = {
  entities: {
    Order: makeEntity("orders"),
    Review: makeEntity("reviews"),
  },
}
