const SummaryCard = ({ title, value, helpText }) => (
  <div className="summary-card p-4 h-100">
    <p className="summary-label mb-2">{title}</p>
    <h3 className="summary-value mb-2">{value}</h3>
    <p className="summary-help mb-0">{helpText}</p>
  </div>
);

export default SummaryCard;
