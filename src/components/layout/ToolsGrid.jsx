import { motion } from 'framer-motion';

export default function ToolsGrid({ tools, onToolClick, isLimitReached }) {
  return (
    <div 
      id="tools"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4"
    >
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        const isSoon = tool.soon;
        const isDisabled = isSoon || (isLimitReached && !isSoon);

        return (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={!isDisabled ? { y: -12, scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            onClick={() => !isDisabled && onToolClick(tool.id)}
            disabled={isDisabled}
            className={`
              relative group p-6 transition-all duration-300
              ${isDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `} // rounded-2xl quitado
          >
            {/* Fondo con blur */}
            <div className={`
              absolute inset-0 bg-black/30 backdrop-blur-xl
              border ${isDisabled ? 'border-neon/10' : 'border-neon/20 group-hover:border-neon'}
              shadow-lg ${isDisabled ? '' : 'group-hover:shadow-neon-lg'}
              transition-all duration-300
            `} /> {/* rounded-2xl quitado */}

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3 w-full justify-between">
                <div className={`
                  p-3 transition-all duration-300
                  ${isDisabled 
                    ? 'bg-neon/5' 
                    : 'bg-neon/10 group-hover:bg-neon/20 group-hover:scale-110'
                  }
                `}> {/* rounded-xl quitado */}
                  <Icon className={`
                    w-7 h-7 transition-all duration-300
                    ${isDisabled ? 'text-neon/50' : 'text-neon group-hover:text-neon-light'}
                  `} />
                </div>

                {isSoon && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 font-medium"> {/* rounded-full quitado */}
                    PRONTO
                  </span>
                )}
              </div>

             <h3 className={`
                font-bold text-left text-lg transition-all duration-300
                ${isDisabled ? 'text-gray-500' : 'text-white group-hover:text-neon'}
              `}>
                {tool.name}
              </h3>
              <p className={`
                text-sm text-left mt-1 transition-all duration-300
                ${isDisabled ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-200'}
              `}>
                {tool.desc}
              </p>
            </div>

            {/* Efecto glow al hover */}
            {!isDisabled && (
              <div className="absolute inset-0 bg-neon/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" /> 
            )}
          </motion.button>
        );
      })}
    </div>
  );
}