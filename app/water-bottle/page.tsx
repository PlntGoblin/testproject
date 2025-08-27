import Link from "next/link";

export default function Instructions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            How to Make the Perfect PB&J Sandwich
          </h1>
        

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-600">
              <li className="bg-amber-50 p-3 rounded">
                <span className="font-medium">Gather your ingredients</span> - Make sure you have fresh bread and your favorite peanut butter and jelly.
              </li>
              <li className="bg-orange-50 p-3 rounded">
                <span className="font-medium">Spread the peanut butter</span> - Using a clean knife, spread peanut butter evenly on one slice of bread, covering it from edge to edge.
              </li>
              <li className="bg-amber-50 p-3 rounded">
                <span className="font-medium">Clean the knife</span> - Wipe or rinse the knife to avoid mixing peanut butter with jelly.
              </li>
              <li className="bg-orange-50 p-3 rounded">
                <span className="font-medium">Spread the jelly</span> - Apply jelly or jam to the other slice of bread, spreading evenly but leaving a small border.
              </li>
              <li className="bg-amber-50 p-3 rounded">
                <span className="font-medium">Combine the slices</span> - Carefully place the peanut butter slice on top of the jelly slice, with the spreads facing each other.
              </li>
              <li className="bg-orange-50 p-3 rounded">
                <span className="font-medium">Cut and serve</span> - Cut the sandwich diagonally or straight down the middle. Enjoy immediately!
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Pro Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Toast the bread lightly for extra crunch</li>
              <li>Try different jelly flavors for variety</li>
              <li>Add sliced bananas for a twist</li>
              <li>Use crunchy peanut butter for texture</li>
            </ul>
          </div>

          <div className="text-center">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}