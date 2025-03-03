import PokemonList from "@/components/Pakemon";

const Home = () => {
  return ( 
    <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto py-10">
      <PokemonList />
    </div>
  </div>
   );
}
 
export default Home;