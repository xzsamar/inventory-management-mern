import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function SearchBar({ name, setName, category, setCategory }) {
  return (
    <Form>
      <Row className="g-3 align-items-end">
        <Col md={6}>
          <Form.Label>Search by name</Form.Label>
          <Form.Control className="input-soft" value={name} placeholder="e.g., Apple" onChange={(e) => setName(e.target.value)} />
        </Col>
        <Col md={6}>
          <Form.Label>Filter by category</Form.Label>
          <Form.Control className="input-soft" value={category} placeholder="e.g., Fruits" onChange={(e) => setCategory(e.target.value)} />
        </Col>
      </Row>
    </Form>
  );
}
