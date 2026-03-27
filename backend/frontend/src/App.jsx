import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import ProductCard from "./components/ProductCard.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import { fetchDashboard, viewProductDetails } from "./services/productService.js";

const categoryOptions = [
  "All",
  "Menswear",
  "Accessories",
  "Footwear",
  "Bags",
  "Audio",
  "Wearables",
  "Peripherals",
  "Displays",
  "Storage"
];

const App = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusSource, setStatusSource] = useState("mongodb");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [activeProductId, setActiveProductId] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboardResponse = await fetchDashboard({
          ...(selectedCategory !== "All" ? { category: selectedCategory } : {}),
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
          sort: selectedSort
        });

        setProducts(dashboardResponse.products);
        setSummary(dashboardResponse.metrics);
        setStatusSource(dashboardResponse.source);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to fetch product data. Please verify the Express API and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [searchTerm, selectedCategory, selectedSort]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSort("latest");
  };

  const handleViewProduct = async (product) => {
    try {
      setInteractionLoading(true);
      setActiveProductId(product._id || product.name);

      const response = await viewProductDetails(product._id || product.name);

      setSelectedProduct(response.product);
      setRelatedProducts(response.relatedProducts || []);
      setModalOpen(true);

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          (item._id || item.name) === (response.product._id || response.product.name)
            ? { ...item, viewCount: response.product.viewCount, lastViewedAt: response.product.lastViewedAt }
            : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load product details. Please try again."
      );
    } finally {
      setInteractionLoading(false);
      setActiveProductId("");
    }
  };

  return (
    <div className="app-shell">
      <Container className="py-5">
        <section className="hero-panel">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <span className="hero-chip">MERN Full Stack Integration</span>
              <h1 className="display-5 fw-semibold text-white mt-3 mb-3">
                Product intelligence dashboard powered by React, Express, Axios, and MongoDB.
              </h1>
              <p className="hero-text mb-0">
                A polished storefront-style interface that consumes RESTful Express endpoints,
                handles loading and error states, and scales from mock mode to live MongoDB with
                no frontend changes.
              </p>
            </Col>
            <Col lg={5}>
              <div className="hero-status-card">
                <p className="status-title mb-3">Integration Status</p>
                <div className="status-row">
                  <span>API Client</span>
                  <strong>Axios Connected</strong>
                </div>
                <div className="status-row">
                  <span>Server Layer</span>
                  <strong>Express REST API</strong>
                </div>
                <div className="status-row">
                  <span>Data Source</span>
                  <strong>{statusSource === "mongodb" ? "MongoDB Live" : "Mock Fallback"}</strong>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {loading ? (
          <div className="loading-panel">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3 mb-0">Loading products from the API...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mt-4 shadow-sm">
            {error}
          </Alert>
        ) : (
          <>
            <Row className="g-4 mt-1">
              <Col md={6} xl={3}>
                <SummaryCard
                  title="Products"
                  value={summary?.totalProducts ?? 0}
                  helpText="Catalog items returned by the backend."
                />
              </Col>
              <Col md={6} xl={3}>
                <SummaryCard
                  title="Categories"
                  value={summary?.categories ?? 0}
                  helpText="Distinct product groups available in the feed."
                />
              </Col>
              <Col md={6} xl={3}>
                <SummaryCard
                  title="Average Price"
                  value={`$${summary?.averagePrice ?? 0}`}
                  helpText="Computed from the current API response."
                />
              </Col>
              <Col md={6} xl={3}>
                <SummaryCard
                  title="Inventory Units"
                  value={summary?.inventoryUnits ?? 0}
                  helpText="Total units available across the catalog."
                />
              </Col>
            </Row>

            <section className="filter-panel mt-4">
              <Row className="g-3 align-items-end">
                <Col lg={5}>
                  <Form.Label className="filter-label">Search Products</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or description"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="filter-input"
                  />
                </Col>
                <Col md={6} lg={3}>
                  <Form.Label className="filter-label">Category</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="filter-input"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} lg={2}>
                  <Form.Label className="filter-label">Sort By</Form.Label>
                  <Form.Select
                    value={selectedSort}
                    onChange={(event) => setSelectedSort(event.target.value)}
                    className="filter-input"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Top Rated</option>
                  </Form.Select>
                </Col>
                <Col lg={2}>
                  <Button variant="outline-dark" className="w-100 rounded-pill" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </section>

            {statusSource !== "mongodb" ? (
              <Alert variant="warning" className="mt-4 border-0 shadow-sm">
                The backend is currently serving seeded mock data because `MONGO_URI` is not set or
                MongoDB is unavailable. Add your database configuration to enable live persistence.
              </Alert>
            ) : null}

            <section className="mt-5">
              <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
                <div>
                  <p className="section-kicker mb-2">Catalog Overview</p>
                  <h2 className="section-title mb-0">Featured products</h2>
                </div>
                <p className="section-description mb-0">
                  {products.length} product{products.length === 1 ? "" : "s"} matched from the live
                  Express API.
                </p>
              </div>

              {products.length === 0 ? (
                <div className="empty-panel">
                  <h3 className="h5 mb-2">No products matched your filters</h3>
                  <p className="mb-0 text-secondary">
                    Try a different keyword, category, or reset the filters.
                  </p>
                </div>
              ) : (
                <Row className="g-4">
                  {products.map((product) => (
                    <Col md={6} xl={4} key={product._id || product.name}>
                      <ProductCard
                        product={product}
                        onView={handleViewProduct}
                        isActive={activeProductId === (product._id || product.name)}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </section>
          </>
        )}
      </Container>
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        centered
        size="lg"
        contentClassName="product-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold">Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {selectedProduct ? (
            <Row className="g-4 align-items-start">
              <Col md={6}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="img-fluid modal-product-image"
                />
              </Col>
              <Col md={6}>
                <p className="product-category mb-2">{selectedProduct.category}</p>
                <h3 className="fw-semibold mb-3">{selectedProduct.name}</h3>
                <p className="text-secondary mb-3">{selectedProduct.description}</p>
                <div className="modal-stat-grid">
                  <div className="modal-stat-card">
                    <span>Price</span>
                    <strong>${selectedProduct.price?.toFixed(2)}</strong>
                  </div>
                  <div className="modal-stat-card">
                    <span>Rating</span>
                    <strong>{selectedProduct.rating}/5</strong>
                  </div>
                  <div className="modal-stat-card">
                    <span>Stock</span>
                    <strong>{selectedProduct.stock} units</strong>
                  </div>
                  <div className="modal-stat-card">
                    <span>Views</span>
                    <strong>{selectedProduct.viewCount ?? 0}</strong>
                  </div>
                </div>
                <p className="mt-4 mb-2 fw-semibold">Backend interaction</p>
                <p className="text-secondary mb-0">
                  This action called the Express API, updated product engagement in MongoDB, and
                  fetched related products from the same category.
                </p>
              </Col>
            </Row>
          ) : null}

          {relatedProducts.length > 0 ? (
            <div className="mt-4">
              <p className="fw-semibold mb-3">Related products</p>
              <Row className="g-3">
                {relatedProducts.map((product) => (
                  <Col sm={4} key={product._id || product.name}>
                    <div className="related-product-card h-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid related-product-image mb-3"
                      />
                      <p className="mb-1 fw-semibold">{product.name}</p>
                      <small className="text-secondary d-block">{product.category}</small>
                      <small className="text-secondary">${product.price?.toFixed(2)}</small>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
      <footer className="site-footer">
        <Container className="py-4">
          <div className="footer-card">
            <p className="footer-title mb-1">Created by ADITYA CHHIKARA</p>
            <a
              className="footer-link"
              href="https://www.linkedin.com/in/aditya-chhikara-9a7453306"
              target="_blank"
              rel="noreferrer"
            >
              www.linkedin.com/in/aditya-chhikara-9a7453306
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default App;
