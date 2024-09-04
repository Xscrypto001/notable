const Input = ({ label, type, name, value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
    />
  </div>
);

export default Input;