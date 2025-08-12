import React, { useEffect, useState } from 'react';
import { Offcanvas, ListGroup, Spinner } from 'react-bootstrap';
import api from '../api';

export default function HistorySidebar({ show, onHide, product }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!product) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${product._id}/history`);
        setLogs(res.data);
      } finally {
        setLoading(false);
      }
    };
    if (show) load();
  }, [show, product]);

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Inventory History — {product?.name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? <Spinner animation="border" /> : (
          <ListGroup>
            {logs.map(l => (
              <ListGroup.Item key={l._id}>
                <div><strong>Date:</strong> {new Date(l.date).toLocaleString()}</div>
                <div><strong>Old Qty:</strong> {l.oldQty} → <strong>New Qty:</strong> {l.newQty}</div>
                <div><strong>User:</strong> {l.user}</div>
              </ListGroup.Item>
            ))}
            {logs.length === 0 && <div>No history yet.</div>}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
