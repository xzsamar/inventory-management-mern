import React, { useState } from 'react';
import { Table, Button, Form, Badge } from 'react-bootstrap';
import api from '../api';

export default function ProductTable({ products, setProducts, onSelectHistory }) {
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});

  const enterEdit = (p) => {
    setEditId(p._id);
    setDraft({ ...p });
  };
  const cancelEdit = () => {
    setEditId(null);
    setDraft({});
  };
  const saveEdit = async () => {
    const res = await api.put(`/products/${editId}`, {
      name: draft.name,
      unit: draft.unit,
      category: draft.category,
      brand: draft.brand,
      stock: draft.stock,
      status: draft.status,
      image: draft.image
    });
    setProducts((prev) => prev.map(x => x._id === res.data._id ? res.data : x));
    cancelEdit();
  };
  const del = async (id) => {
    // Optional: implement delete if needed; not required by assignment
    alert('Delete not implemented in backend, skip for now.');
  };

  const StatusBadge = ({ stock }) => (
    stock > 0
      ? <Badge bg="success">In Stock</Badge>
      : <Badge bg="danger">Out of Stock</Badge>
  );

  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p._id}>
            <td style={{ width: 90 }}>
              {editId === p._id ? (
                <Form.Control
                  placeholder="Image URL"
                  value={draft.image || ''}
                  onChange={(e) => setDraft(d => ({ ...d, image: e.target.value }))}
                />
              ) : (
                p.image ? <img src={p.image} alt={p.name} style={{ width: 70, height: 50, objectFit: 'cover' }} /> : '—'
              )}
            </td>
            <td>
              {editId === p._id ? (
                <Form.Control value={draft.name} onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))} />
              ) : p.name}
            </td>
            <td>
              {editId === p._id ? (
                <Form.Control value={draft.unit || ''} onChange={(e) => setDraft(d => ({ ...d, unit: e.target.value }))} />
              ) : p.unit}
            </td>
            <td>
              {editId === p._id ? (
                <Form.Control value={draft.category || ''} onChange={(e) => setDraft(d => ({ ...d, category: e.target.value }))} />
              ) : p.category}
            </td>
            <td>
              {editId === p._id ? (
                <Form.Control value={draft.brand || ''} onChange={(e) => setDraft(d => ({ ...d, brand: e.target.value }))} />
              ) : p.brand}
            </td>
            <td style={{ width: 120 }}>
              {editId === p._id ? (
                <Form.Control type="number" min={0} value={draft.stock} onChange={(e) => setDraft(d => ({ ...d, stock: Number(e.target.value) }))} />
              ) : p.stock}
            </td>
            <td>
              {editId === p._id ? (
                <Form.Select value={draft.status} onChange={(e) => setDraft(d => ({ ...d, status: e.target.value }))}>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </Form.Select>
              ) : (
                <StatusBadge stock={p.stock} />
              )}
            </td>
            <td style={{ width: 220 }}>
              {editId === p._id ? (
                <>
                  <Button size="sm" variant="success" onClick={saveEdit} className="me-2">Save</Button>
                  <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="primary" onClick={() => enterEdit(p)} className="me-2">Edit</Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => onSelectHistory(p)}>History</Button>
                  {/* <Button size="sm" variant="danger" onClick={() => del(p._id)} className="ms-2">Delete</Button> */}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
