import React, { useEffect, useState } from 'react';
import { Offcanvas, ListGroup } from 'react-bootstrap';
import api from '../api';

export default function HistorySidebar({ show, onHide, product }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (product) {
      api.get(`/products/${product._id}/history`).then(res => setHistory(res.data));
    }
  }, [product]);

  return (
    <Offcanvas placement="end" show={show} onHide={onHide}>
      <Offcanvas.Header closeButton><Offcanvas.Title>History - {product?.name}</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body>
        <ListGroup>
          {history.map(h => (
            <ListGroup.Item key={h._id}>
              {new Date(h.date).toLocaleString()} — {h.oldQty} → {h.newQty} (by {h.user})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
