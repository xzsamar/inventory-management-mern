import React, { useState } from 'react';
import { Table, Button, Form, Badge } from 'react-bootstrap';
import { FiEdit2, FiClock, FiSave, FiX } from 'react-icons/fi';
import api from '../api';

export default function ProductTable({ products, setProducts, onSelectHistory }) {
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});

  const safeProducts = Array.isArray(products) ? products : [];

  const enterEdit = (product) => {
    setEditId(product._id);
    setDraft({ ...product });
  };

  const cancelEdit = () => {
    setEditId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    try {
      const res = await api.put(`/products/${editId}`, draft);
      setProducts(safeProducts.map((p) => (p._id === editId ? res.data : p)));
      cancelEdit();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save changes.');
    }
  };

  const StatusBadge = ({ stock }) =>
    stock > 0 ? (
      <Badge bg="success">In Stock</Badge>
    ) : (
      <Badge bg="danger">Out of Stock</Badge>
    );

  const remove = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <Table responsive bordered hover className="align-middle">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {safeProducts.map((p) => (
          <tr key={p._id}>
            <td>
              {editId === p._id ? (
                <Form.Control
                  placeholder="Image URL"
                  value={draft.image || ''}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                />
              ) : p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: 70,
                    height: 50,
                    objectFit: 'cover',
                    borderRadius: 6,
                  }}
                />
              ) : (
                '—'
              )}
            </td>

            <td>
              {editId === p._id ? (
                <Form.Control
                  value={draft.name || ''}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              ) : (
                p.name
              )}
            </td>

            <td>
              {editId === p._id ? (
                <Form.Control
                  value={draft.unit || ''}
                  onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                />
              ) : (
                p.unit
              )}
            </td>

            <td>{p.category}</td>
            <td>{p.brand}</td>

            <td style={{ width: 120 }}>
              {editId === p._id ? (
                <Form.Control
                  type="number"
                  min={0}
                  value={draft.stock}
                  onChange={(e) =>
                    setDraft({ ...draft, stock: Number(e.target.value) })
                  }
                />
              ) : (
                p.stock
              )}
            </td>

            <td>
              {editId === p._id ? (
                <Form.Select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value })
                  }
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </Form.Select>
              ) : (
                <StatusBadge stock={p.stock} />
              )}
            </td>

            <td className="text-end" style={{ width: 240 }}>
              {editId === p._id ? (
                <>
                  <Button
                    size="sm"
                    variant="success"
                    className="me-2"
                    onClick={saveEdit}
                  >
                    <FiSave className="me-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={cancelEdit}
                  >
                    <FiX className="me-1" /> Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="btn-brand me-2"
                    onClick={() => enterEdit(p)}
                  >
                    <FiEdit2 className="me-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    className="me-2"
                    onClick={() => onSelectHistory(p)}
                  >
                    <FiClock className="me-1" /> History
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => remove(p._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
