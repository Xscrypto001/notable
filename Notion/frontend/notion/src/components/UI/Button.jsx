const Button = ({ type, children, className }) => (
  <button type={type} className={`px-4 py-2 ${className}`}>
    {children}
  </button>
);

export default Button;