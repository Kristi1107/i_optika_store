import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/70 z-10"/>
        <div className="relative h-[80vh] bg-gray-300">
          {/* Replace this div with a real image when you have one */}
          <div className="w-full h-full flex items-center">
            <div className="container mx-auto px-6 relative z-20">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  See the World in Style
                </h1>
                <p className="text-xl mb-8">
                  Discover our premium collection of eyewear designed to enhance your vision and elevate your style.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="bg-white text-indigo-900 px-8 py-3 rounded-full font-medium hover:bg-white/90 transition">
                      Shop Now
                    </Link>
                    <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition">
                      Virtual Try-On
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Eyeglasses', link: '/products?category=eyeglasses' },
              { name: 'Sunglasses', link: '/products?category=sunglasses' },
              { name: 'Contact Lenses', link: '/products?category=contact-lenses' },
              { name: 'Accessories', link: '/products?category=accessories' },
            ].map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group relative h-64 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center"
                >
                  {/* Replace with real images later */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <h3 className="relative z-10 text-white text-2xl font-bold">{category.name}</h3>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Virtual Try-On',
                desc: 'See how frames look on your face before you buy with out AR technology.',
                icon: '👓'
              },
              {
                title: 'Prescription Upload',
                desc: 'Simply upload your prescription and we\'ll handle the rest.',
                icon:'📋'
              },
              {
                title: 'Free Shipping',
                desc: 'Enjoy free shipping on all orders over $100.',
                icon: '🚚'
              }
            ].map((feature, index) => (
              <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}