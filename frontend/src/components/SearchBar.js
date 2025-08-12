import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function SearchBar({ name, setName, category, setCategory, onAdd }) {
  return (
    <Form className="mb-3">
      <Row className="align-items-end">
        <Col md={4}>
          <Form.Label>Search by name</Form.Label>
          <Form.Control
            placeholder="e.g. Apple"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Filter by category</Form.Label>
          <Form.Control
            placeholder="e.g. Fruits"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={onAdd}>Add New Product</Button>
        </Col>
      </Row>
    </Form>
  );
}
