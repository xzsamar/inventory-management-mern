import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import api from './api';
import SearchBar from './components/SearchBar';
import ImportExportButtons from './components/ImportExportButtons';
import ProductTable from './components/ProductTable';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]); // always start with array
  const [showHistory, setShowHistory] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { name, category } });

      // Handle both array and pagination object
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }
  };

  useEffect(() => {
    
  }, [name, category]);

  return (
    <>
      <Navbar bg="white" className="mb-4 border-bottom">
        <Container>
          <Navbar.Brand style={{ color: 'var(--brand)' }}>Inventory Manager</Navbar.Brand>
          <ImportExportButtons onImported={fetchProducts} />
        </Container>
      </Navbar>

      <Container>
        <div className="card p-3 mb-3">
          <SearchBar
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
          />
        </div>

        <Row>
          <Col>
            {products.length > 0 ? (
              <ProductTable
                products={products}
                setProducts={setProducts}
                onSelectHistory={(p) => {
                  setHistoryProduct(p);
                  setShowHistory(true);
                }}
              />
            ) : (
              <div className="text-center py-5 text-muted">
                No products found. Import a CSV to get started.
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <HistorySidebar
        show={showHistory}
        onHide={() => setShowHistory(false)}
        product={historyProduct}
      />
    </>
  );
}

export default App;
