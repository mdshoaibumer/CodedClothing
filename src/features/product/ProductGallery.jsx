import { tshirts } from '../../data/tshirts';
import TShirtCard from '../../components/product/TShirtCard';

export default function ProductGallery() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
          Choose Your T-Shirt
        </h1>
        <p className="text-gray-500 mb-10">
          Select color and start customizing your design
        </p>
      </div>

      {/* 2 columns mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {tshirts.map((shirt) => (
          <TShirtCard key={shirt.id} product={shirt} />
        ))}
      </div>
    </div>
  );
}