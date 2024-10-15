const Navbar = () => {
    return (
      <nav className="bg-gradient-to-l from-green-700 to-green-700 shadow-md fixed top-0 left-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Clínica Caótica</div>
            <div className="space-x-4 text-white font-bold">
              <a href="/home" className="hover:text-gray-400">
                Home
              </a>
              <a href="/sobre" className="hover:text-gray-400">
                Sobre Nós
              </a>
              <a href="/servicos" className="hover:text-gray-400">
                Serviços
              </a>
              <a href="/contato" className="hover:text-gray-400">
                Contato
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;