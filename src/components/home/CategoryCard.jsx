import { getCategoryRoute } from "../../utils/categoryNavigation";

export default function CategoryCard({ category }) {
  const imageSrc = category.categoryImage || category.image;

  return (
    <a
      href={`#${getCategoryRoute(category)}`}
      className="group flex w-full flex-col items-center text-center"
    >
      {/* Image Only */}
      <div
        className="
          flex
          aspect-square
          w-full
          max-w-[190px]
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          bg-gradient-to-br
          from-slate-50
          to-[#faf2fc]
          p-2
          transition
          duration-300
          group-hover:scale-[1.02]
          sm:max-w-[210px]
        "
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={category.name}
            className="h-full w-full rounded-lg object-contain"
          />
        ) : (
          <span className="text-5xl text-[#79259c]">
            {category.icon || "💊"}
          </span>
        )}
      </div>

      {/* Category Name */}
      <div className="mt-3">
        <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#79259c] sm:text-2xl">
          {category.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-[#79259c]">
          Explore care
        </p>
      </div>
    </a>
  );
}