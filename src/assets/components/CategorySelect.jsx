const CategorySelect = ({ value, onChange }) => {
  return (
    <div className="relative w-[80%] sm:w-[35%]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-lg bg-gray-200 px-4 py-3 transition duration-300 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-0"
      >
        <option value="">Всі категорії</option>
        <option value="Піца">Піца</option>
        <option value="Бургери">Бургери</option>
        <option value="Суші">Суші</option>
        <option value="Закуски">Закуски</option>
        <option value="Напої">Напої</option>
      </select>
    </div>
  );
};

export default CategorySelect;
