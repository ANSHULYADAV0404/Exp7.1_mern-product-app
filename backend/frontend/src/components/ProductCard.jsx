import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { FiStar, FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product, onView, isActive }) => (
  <Card className="product-card border-0 h-100 shadow-sm">
    <div className="product-image-wrap">
      <Card.Img variant="top" src={product.image} alt={product.name} className="product-image" />
      <Badge bg="light" text="dark" className="product-badge">
        {product.badge}
      </Badge>
    </div>
    <Card.Body className="d-flex flex-column p-4">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <p className="text-uppercase product-category mb-1">{product.category}</p>
          <Card.Title className="fs-5 fw-semibold mb-0">{product.name}</Card.Title>
        </div>
        <div className="rating-pill">
          <FiStar className="me-1" />
          {product.rating}
        </div>
      </div>

      <Card.Text className="text-secondary flex-grow-1">{product.description}</Card.Text>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <p className="price-tag mb-1">${product.price.toFixed(2)}</p>
          <small className="text-secondary">{product.stock} units available</small>
        </div>
        <Button
          variant="dark"
          className="rounded-pill px-3"
          onClick={() => onView(product)}
          disabled={isActive}
        >
          <FiShoppingCart className="me-2" />
          {isActive ? "Opening..." : "View"}
        </Button>
      </div>
    </Card.Body>
  </Card>
);

export default ProductCard;
