import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Plus, Trash2, Check, Share2, BarChart3,
  Copy, Users, Package, Clock, TrendingUp,
  Sparkles, X, Calendar,
  PieChart, ArrowRight, Loader2, CheckCircle2, Circle,
  ListChecks, Home, Edit3, Save, List, LayoutGrid,
  TrendingDown, Euro, Star, ShoppingBasket, Search
} from 'lucide-react'
import confetti from 'canvas-confetti'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// CATEGORÍAS MEJORADAS
const CATEGORY_KEYWORDS = {
  'Frutas y Verduras': ['manzana','manzanas','plátano','plátanos','platano','platanos','banana','bananas','naranja','naranjas','mandarina','mandarinas','clementina','limón','limones','limon','lima','pomelo','fresa','fresas','fresón','frambuesa','frambuesas','mora','moras','arándano','arándanos','arandano','arandanos','cereza','cerezas','melocotón','melocotones','melocoton','nectarina','albaricoque','albaricoques','ciruela','ciruelas','uva','uvas','pera','peras','mango','mangos','piña','piñas','papaya','kiwi','kiwis','sandía','sandias','sandia','melón','melones','melon','aguacate','aguacates','coco','granada','higo','higos','dátil','dátiles','fruta','frutas','tomate','tomates','cherry','lechuga','lechugas','escarola','endivia','rúcula','rucula','canónigo','espinaca','espinacas','acelga','acelgas','kale','col','coles','repollo','lombarda','coliflor','brócoli','brocoli','cebolla','cebollas','cebolleta','cebollino','chalota','ajo','ajos','ajete','puerro','puerros','apio','zanahoria','zanahorias','nabo','rábano','rábanos','rabano','remolacha','patata','patatas','papa','papas','boniato','batata','calabaza','calabacín','calabacines','calabacin','berenjena','berenjenas','pimiento','pimientos','pepino','pepinos','pepinillo','judía verde','judías verdes','judia verde','judias verdes','guisante','guisantes','haba','habas','alcachofa','alcachofas','espárrago','espárragos','esparrago','esparragos','champiñón','champiñones','seta','setas','shiitake','portobello','maíz','maiz','jengibre','cúrcuma','curcuma','perejil','cilantro','albahaca','menta','hierbabuena','romero','tomillo','orégano','oregano','laurel','verdura','verduras','hortaliza','ensalada','vegetal','vegetales'],
  'Carnes': ['pollo','pollos','pechuga','pechugas','muslo','muslos','contramuslo','alita','alitas','ternera','vaca','buey','filete','filetes','entrecot','solomillo','chuletón','chuleton','bistec','cerdo','lomo','costilla','costillas','chuleta','chuletas','secreto','pluma','presa','panceta','tocino','bacon','beicon','lacón','codillo','cordero','lechal','cabrito','paletilla','pavo','conejo','pato','codorniz','hamburguesa','hamburguesas','burger','albóndiga','albóndigas','albondiga','carne picada','picada','jamón','jamon','jamón serrano','jamon serrano','jamón york','jamon york','chorizo','chorizos','salchichón','salchichon','fuet','longaniza','salchicha','salchichas','frankfurt','butifarra','morcilla','chistorra','sobrasada','mortadela','chopped','fiambre','embutido','paté','pate','foie','hígado','carne','carnes','carnicería','charcutería'],
  'Pescados y Mariscos': ['pescado','pescados','salmón','salmon','trucha','atún','atun','bonito','merluza','pescadilla','bacalao','lubina','róbalo','dorada','besugo','rape','lenguado','rodaballo','sardina','sardinas','boquerón','boquerones','anchoa','anchoas','caballa','jurel','pez espada','emperador','gamba','gambas','langostino','langostinos','camarón','cigala','cigalas','bogavante','langosta','cangrejo','centollo','nécora','mejillón','mejillones','almeja','almejas','chirla','berberecho','navaja','ostra','vieira','pulpo','calamar','calamares','chipirón','chipirones','sepia','marisco','mariscos','surimi','gulas'],
  'Lácteos': ['leche','leches','leche entera','leche desnatada','leche semidesnatada','leche semi','leche sin lactosa','sin lactosa','yogur','yogures','yogurt','yogur natural','yogur griego','activia','danone','actimel','kéfir','kefir','cuajada','requesón','requeson','queso','quesos','quesito','queso fresco','burgos','queso tierno','queso curado','queso semicurado','mozzarella','parmesano','cheddar','gouda','edam','emmental','brie','camembert','roquefort','manchego','tetilla','cabrales','queso crema','philadelphia','mascarpone','ricotta','burrata','queso rallado','lonchas','mantequilla','margarina','nata','natas','crema','batido','batidos','flan','natillas','petit suisse','helado','helados','polo','magnum','lácteo','lacteo','lácteos','lacteos'],
  'Panadería': ['pan','panes','panecillo','barra','barras','baguette','chapata','ciabatta','focaccia','hogaza','pan de molde','pan molde','pan bimbo','pan integral','integral','pan centeno','mollete','bollo','bollos','croissant','cruasán','napolitana','palmera','ensaimada','brioche','donut','donuts','berlina','rosquilla','magdalena','magdalenas','muffin','bizcocho','galleta','galletas','cookie','cookies','tostada','tostadas','biscote','churro','churros','porra','torrija','gofre','waffle','crepe','tortita','empanada','empanadilla','hojaldre','masa','levadura','panadería','bollería','pastelería','pastel','tarta'],
  'Bebidas': ['agua','aguas','agua mineral','agua con gas','zumo','zumos','jugo','néctar','refresco','refrescos','gaseosa','coca cola','coca-cola','cocacola','pepsi','cola','fanta','kas','sprite','aquarius','isotónico','gatorade','red bull','monster','tónica','tonica','schweppes','cerveza','cervezas','cerveza sin','sin alcohol','vino','vinos','vino tinto','vino blanco','vino rosado','cava','champán','prosecco','vermut','sangría','sangria','tinto de verano','sidra','ginebra','gin','vodka','ron','whisky','brandy','licor','café','cafe','café molido','café soluble','nescafé','descafeinado','té','te','infusión','infusion','manzanilla','poleo','tila','cacao','colacao','cola cao','nesquik','horchata','leche almendra','leche soja','leche avena','bebida vegetal','smoothie','bebida','bebidas'],
  'Despensa': ['arroz','arroces','arroz blanco','arroz integral','arroz basmati','pasta','pastas','espagueti','espaguetis','spaghetti','macarrón','macarrones','tallarín','fideo','fideos','lasaña','canelón','canelones','ravioli','tortellini','ñoqui','gnocchi','cuscús','quinoa','bulgur','harina','harinas','maizena','pan rallado','azúcar','azucar','azúcar moreno','edulcorante','stevia','sal','sal fina','sal gorda','aceite','aceites','aceite oliva','aceite de oliva','virgen extra','aove','aceite girasol','vinagre','vinagres','vinagre balsámico','salsa','salsas','tomate frito','tomate triturado','sofrito','mayonesa','kétchup','ketchup','mostaza','salsa soja','pimienta','pimentón','pimenton','paprika','comino','curry','canela','nuez moscada','especias','condimento','caldo','caldos','avecrem','lenteja','lentejas','garbanzo','garbanzos','alubia','alubias','judía','legumbre','legumbres','conserva','conservas','lata','latas','atún en lata','sardina en lata','aceituna','aceitunas','oliva','olivas','alcaparra','miel','mermelada','nocilla','nutella','crema cacao','fruto seco','frutos secos','almendra','almendras','nuez','nueces','avellana','cacahuete','pistacho','anacardo','pipa','pipas','cereales','cereal','muesli','granola','avena','copos avena','chocolate','chocolates','cacao','despensa'],
  'Congelados': ['congelado','congelados','pizza congelada','pizza','pizzas','croqueta','croquetas','san jacobo','nugget','nuggets','fingers','patatas congeladas','verduras congeladas','menestra','salteado','guisantes congelados','pescado congelado','marisco congelado','gambas congeladas','pollo congelado','hamburguesa congelada','lasaña congelada','hielo','cubitos'],
  'Limpieza': ['jabón','jabon','detergente','detergentes','suavizante','lejía','lejia','lavavajillas','fairy','finish','limpiador','multiusos','fregasuelos','limpiacristales','desinfectante','amoniaco','quitagrasas','antical','quitamanchas','estropajo','esponja','bayeta','trapo','paño','fregona','mopa','escoba','recogedor','cepillo','cubo','guante','guantes','bolsa basura','bolsas basura','papel aluminio','albal','film','papel horno','servilleta','servilletas','papel cocina','rollo cocina','ambientador','insecticida','limpieza','droguería'],
  'Higiene Personal': ['champú','champu','shampoo','acondicionador','gel','gel ducha','gel baño','desodorante','deo','pasta dientes','dentífrico','cepillo dientes','hilo dental','enjuague bucal','colutorio','crema hidratante','crema corporal','crema facial','protector solar','maquinilla','cuchilla','espuma afeitar','aftershave','colonia','perfume','pañuelo','pañuelos','kleenex','papel higiénico','papel higienico','toallita','toallitas','compresa','compresas','tampón','tampones','pañal','pañales','bastoncillo','algodón','tirita','tiritas','esparadrapo','venda','gasa','alcohol','agua oxigenada','betadine','termómetro','mascarilla','higiene','farmacia'],
  'Snacks y Dulces': ['patatas fritas','chips','pringles','lays','ruffles','nachos','doritos','palomitas','popcorn','snack','snacks','aperitivo','picoteo','gusanitos','cheetos','corteza','torreznos','chocolatina','bombón','bombones','caramelo','caramelos','piruleta','chupachups','chicle','chicles','regaliz','gominola','gominolas','golosina','golosinas','haribo','chuches','chuchería','oreo','barrita','barritas','kit kat','twix','mars','snickers','kinder','lacasitos','filipinos','pastelito','bollycao','dulce','dulces'],
  'Mascotas': ['comida perro','pienso perro','comida gato','pienso gato','pienso','arena gato','arena','snack mascota','hueso perro','juguete mascota','collar','correa','champú mascota','antiparasitario','pipeta','comedero','bebedero','cama mascota','transportín','rascador','mascota','mascotas','perro','gato'],
  'Otros': []
}

const detectCategory = (productName) => {
  const nameLower = productName.toLowerCase().trim()
  const words = nameLower.split(/\s+/)
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Otros') continue
    if (keywords.includes(nameLower)) return category
  }
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Otros') continue
    for (const word of words) {
      if (word.length >= 3 && keywords.includes(word)) return category
    }
  }
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Otros') continue
    for (const keyword of keywords) {
      if (keyword.length >= 4 && nameLower.includes(keyword)) return category
    }
  }
  
  return 'Otros'
}

const CATEGORY_ICONS = {
  'Frutas y Verduras': '🥬', 'Carnes': '🥩', 'Pescados y Mariscos': '🐟',
  'Lácteos': '🧀', 'Panadería': '🥖', 'Bebidas': '🥤', 'Despensa': '🫙',
  'Congelados': '🧊', 'Limpieza': '🧹', 'Higiene Personal': '🧴',
  'Snacks y Dulces': '🍫', 'Mascotas': '🐾', 'Otros': '📦'
}

const CATEGORY_COLORS = {
  'Frutas y Verduras': 'from-emerald-500 to-green-600',
  'Carnes': 'from-red-500 to-rose-600',
  'Pescados y Mariscos': 'from-cyan-500 to-blue-600',
  'Lácteos': 'from-amber-400 to-yellow-500',
  'Panadería': 'from-orange-400 to-amber-500',
  'Bebidas': 'from-purple-500 to-violet-600',
  'Despensa': 'from-stone-500 to-zinc-600',
  'Congelados': 'from-sky-400 to-cyan-500',
  'Limpieza': 'from-teal-500 to-emerald-600',
  'Higiene Personal': 'from-pink-500 to-rose-500',
  'Snacks y Dulces': 'from-fuchsia-500 to-pink-600',
  'Mascotas': 'from-lime-500 to-green-500',
  'Otros': 'from-slate-500 to-gray-600'
}

const ALL_CATEGORIES = Object.keys(CATEGORY_ICONS)
const UNITS = ['unidad', 'kg', 'g', 'L', 'ml', 'docena', 'paquete', 'lata', 'botella', 'bolsa', 'bote', 'tarrina', 'bandeja', 'manojo', 'racimo']

// MODAL DE EDICIÓN
function EditModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item.name)
  const [quantity, setQuantity] = useState(item.quantity || 1)
  const [unit, setUnit] = useState(item.unit || 'unidad')
  const [category, setCategory] = useState(item.category)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSave = async () => {
    setIsLoading(true)
    await onSave({ ...item, name, quantity, unit, category })
    setIsLoading(false)
    onClose()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#12121a] rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-violet-400" />Editar producto
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-white/50 mb-1 block">Cantidad</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQuantity(Math.max(0.5, quantity - (quantity <= 1 ? 0.5 : 1)))}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 text-lg font-bold">-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  step="0.5" min="0.5" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-center focus:outline-none" />
                <button type="button" onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 text-lg font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Unidad</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none appearance-none cursor-pointer">
                {UNITS.map(u => <option key={u} value={u} className="bg-[#12121a]">{u}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/50 mb-1 block">Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none appearance-none cursor-pointer">
              {ALL_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#12121a]">{CATEGORY_ICONS[cat]} {cat}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 px-6 bg-white/5 rounded-2xl font-medium hover:bg-white/10">Cancelar</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            disabled={isLoading || !name.trim()} className="flex-1 py-3 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" />Guardar</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// PANEL DE COMPARACIÓN DE PRECIOS
function PriceComparisonPanel({ show, onClose, priceComparison, onShare }) {
  if (!show) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        className="w-full max-w-2xl h-[90vh] bg-[#0a0a0f]/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="w-7 h-7 text-emerald-400" />
              Comparar Precios
            </h2>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          {priceComparison && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-sm text-emerald-400 mb-1">Mejor opción</div>
                <div className="text-xl font-bold">{priceComparison.cheapest.supermarket.logo_emoji} {priceComparison.cheapest.supermarket.name}</div>
                <div className="text-2xl font-black text-emerald-400">{priceComparison.cheapest.total.toFixed(2)}€</div>
              </div>
              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                <div className="text-sm text-violet-400 mb-1">Ahorras</div>
                <div className="text-2xl font-black text-violet-400">{priceComparison.savings.toFixed(2)}€</div>
                <div className="text-sm text-white/50">vs más caro</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {priceComparison ? (
            <div className="space-y-3">
              {priceComparison.comparisons.map((comp, index) => {
                const percentage = (comp.total / priceComparison.mostExpensive.total) * 100
                const isCheapest = comp.supermarket.id === priceComparison.cheapest.supermarket.id
                return (
                  <motion.div key={comp.supermarket.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl border ${isCheapest ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{comp.supermarket.logo_emoji}</span>
                        <span className="font-semibold">{comp.supermarket.name}</span>
                        {isCheapest && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">MEJOR PRECIO</span>}
                      </div>
                      <span className="text-2xl font-bold">{comp.total.toFixed(2)}€</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: index * 0.05 + 0.2 }}
                        className={`h-full rounded-full ${isCheapest ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onShare}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 font-semibold flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartir con precios
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// VISTA DE FAVORITOS
function FavoritesView({ show, onClose, favorites, onAdd, searchTerm, setSearchTerm }) {
  if (!show) return null

  const filteredFavorites = favorites.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categoryIcons = {
    'Frutas y Verduras': '🥬', 'Carnes': '🥩', 'Pescados y Mariscos': '🐟', 'Lácteos': '🥛',
    'Panadería': '🥖', 'Bebidas': '🥤', 'Despensa': '🏺', 'Congelados': '🧊',
    'Limpieza': '🧹', 'Higiene Personal': '🧴', 'Snacks y Dulces': '🍫', 'Mascotas': '🐾', 'Otros': '📦'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] bg-[#0a0a0f]/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              Productos Favoritos
            </h2>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input type="text" placeholder="Buscar favorito..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 placeholder:text-white/30" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((fav, index) => (
                <motion.div key={fav.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{categoryIcons[fav.category] || '📦'}</span>
                      <div>
                        <div className="font-semibold">{fav.name}</div>
                        <div className="text-sm text-white/50">{fav.quantity} {fav.unit}</div>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-white/40">Usado {fav.use_count} {fav.use_count === 1 ? 'vez' : 'veces'}</span>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(fav)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Añadir
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/50">
              <Star className="w-16 h-16 mb-4" />
              <p className="text-lg">No hay favoritos aún</p>
              <p className="text-sm">Marca productos con ⭐ para acceso rápido</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// APP PRINCIPAL
function App() {
  const navigate = useNavigate()
  const [view, setView] = useState('home')
  const [currentList, setCurrentList] = useState(null)
  const [items, setItems] = useState([])
  const [newItemName, setNewItemName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [newListName, setNewListName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [stats, setStats] = useState(null)
  const [activeUsers, setActiveUsers] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [viewMode, setViewMode] = useState('compact')
  const inputRef = useRef(null)

  // Estados para comparador de precios
  const [priceComparison, setPriceComparison] = useState(null)
  const [showPriceComparison, setShowPriceComparison] = useState(false)
  const [supermarkets, setSupermarkets] = useState([])
  const [priceEstimates, setPriceEstimates] = useState({})

  // Estados para modo compra
  const [shoppingMode, setShoppingMode] = useState(false)

  // Estados para favoritos
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [favoriteSearchTerm, setFavoriteSearchTerm] = useState('')

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const formatQuantity = (quantity, unit) => {
    if (!unit || unit === 'unidad') return quantity > 1 ? `x${quantity}` : ''
    return `${quantity} ${unit}`
  }

  const copyCode = () => {
    const url = `${window.location.origin}/list/${currentList?.access_code || accessCode}`
    navigator.clipboard.writeText(url)
    setCopiedCode(true)
    showNotification('¡Enlace copiado!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const createList = async () => {
    if (!newListName.trim()) { showNotification('Introduce un nombre', 'error'); return }
    setIsLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data, error } = await supabase.from('shopping_lists').insert([{ name: newListName, access_code: code }]).select().single()
    if (error) { showNotification('Error al crear', 'error'); setIsLoading(false); return }
    setCurrentList(data); setAccessCode(code); setNewListName('')
    setView('list') // Bug fix: actualizar vista antes de navegar
    setIsLoading(false)
    navigate(`/list/${code}`)
    showNotification('¡Lista creada!')
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  }

  const joinList = async () => {
    if (!accessCode.trim()) { showNotification('Introduce un código', 'error'); return }
    setIsLoading(true)
    const { data, error } = await supabase.from('shopping_lists').select('*').eq('access_code', accessCode.toUpperCase()).single()
    if (error || !data) { showNotification('Código no encontrado', 'error'); setIsLoading(false); return }
    setCurrentList(data); setIsLoading(false)
    navigate(`/list/${accessCode.toUpperCase()}`)
    showNotification('¡Te has unido!')
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    const category = detectCategory(newItemName)
    const { error } = await supabase.from('shopping_items').insert([{ list_id: currentList.id, name: newItemName.trim(), quantity: 1, unit: 'unidad', category, completed: false }])
    if (error) { showNotification('Error al añadir', 'error'); return }
    await supabase.from('purchase_history').insert([{ list_id: currentList.id, item_name: newItemName.trim(), category, action: 'added' }])
    setNewItemName(''); inputRef.current?.focus()
  }

  const updateItem = async (updatedItem) => {
    const previousItems = [...items]

    // UPDATE INMEDIATO (optimista)
    setItems(prev => prev.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ))

    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({
          name: updatedItem.name,
          quantity: updatedItem.quantity,
          unit: updatedItem.unit,
          category: updatedItem.category
        })
        .eq('id', updatedItem.id)

      if (error) throw error
      showNotification('Actualizado', 'success')
    } catch (error) {
      // ROLLBACK
      setItems(previousItems)
      showNotification('Error al actualizar', 'error')
    }
  }

  const toggleComplete = async (item) => {
    const previousItems = [...items]
    const newCompleted = !item.completed

    // UPDATE INMEDIATO (optimista)
    setItems(prev => prev.map(i =>
      i.id === item.id
        ? { ...i, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
        : i
    ))

    // Confetti inmediato
    if (newCompleted) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#10b981', '#34d399', '#6ee7b7'] })
    }

    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null
        })
        .eq('id', item.id)

      if (error) throw error

      // Historial solo si no falla
      if (newCompleted) {
        await supabase.from('purchase_history').insert([{
          list_id: currentList.id,
          item_name: item.name,
          category: item.category,
          action: 'purchased'
        }])
      }
    } catch (error) {
      // ROLLBACK
      setItems(previousItems)
      showNotification('Error al actualizar', 'error')
    }
  }

  const deleteItem = async (id) => {
    const previousItems = [...items]

    // DELETE INMEDIATO (optimista)
    setItems(prev => prev.filter(item => item.id !== id))

    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      // ROLLBACK
      setItems(previousItems)
      showNotification('Error al eliminar', 'error')
    }
  }

  const clearCompleted = async () => {
    const completed = items.filter(i => i.completed)
    for (const item of completed) { await supabase.from('shopping_items').delete().eq('id', item.id) }
    showNotification(`${completed.length} eliminados`)
  }

  const loadStats = async () => {
    if (!currentList) return
    setIsLoading(true)
    const { data: history } = await supabase.from('purchase_history').select('*').eq('list_id', currentList.id).eq('action', 'purchased')
    if (history) {
      const productCounts = {}, categoryCounts = {}, dayOfWeekCounts = { 0:0,1:0,2:0,3:0,4:0,5:0,6:0 }
      history.forEach(item => {
        productCounts[item.item_name] = (productCounts[item.item_name] || 0) + 1
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
        dayOfWeekCounts[new Date(item.created_at).getDay()]++
      })
      const topProducts = Object.entries(productCounts).sort((a,b) => b[1]-a[1]).slice(0,10)
      const categoryStats = Object.entries(categoryCounts).sort((a,b) => b[1]-a[1])
      const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
      const mostActiveDay = Object.entries(dayOfWeekCounts).sort((a,b) => b[1]-a[1])[0]
      setStats({ totalPurchases: history.length, topProducts, categoryStats, mostActiveDay: dayNames[parseInt(mostActiveDay?.[0] || 0)], dayOfWeekCounts, dayNames })
    }
    setIsLoading(false); setView('stats')
  }

  // ==========================================
  // FUNCIONES PARA COMPARADOR DE PRECIOS
  // ==========================================

  const loadSupermarkets = async () => {
    const { data, error } = await supabase
      .from('supermarkets')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (data && !error) {
      setSupermarkets(data)

      // Cargar precios estimados
      const { data: estimates } = await supabase
        .from('price_estimates')
        .select('*')

      if (estimates) {
        const estimatesMap = {}
        estimates.forEach(est => {
          if (!estimatesMap[est.supermarket_id]) estimatesMap[est.supermarket_id] = {}
          estimatesMap[est.supermarket_id][est.category] = est.estimated_price_per_unit
        })
        setPriceEstimates(estimatesMap)
      }
    }
  }

  const loadPriceComparison = async () => {
    if (!currentList || !supermarkets.length) return

    setIsLoading(true)

    // Calcular total para cada supermercado
    const comparisons = []

    for (const supermarket of supermarkets) {
      let total = 0
      const pendingItems = items.filter(i => !i.completed)

      for (const item of pendingItems) {
        // 1. Buscar precio personalizado
        const { data: customPrice } = await supabase
          .from('item_prices')
          .select('custom_price')
          .eq('item_id', item.id)
          .eq('supermarket_id', supermarket.id)
          .single()

        let price = customPrice?.custom_price

        // 2. Si no existe, usar estimado por categoría
        if (!price) {
          price = priceEstimates[supermarket.id]?.[item.category] || 0
        }

        // 3. Multiplicar por cantidad
        total += (price * (item.quantity || 1))
      }

      comparisons.push({
        supermarket: supermarket,
        total: total,
        itemCount: pendingItems.length
      })
    }

    // Ordenar por precio (más barato primero)
    comparisons.sort((a, b) => a.total - b.total)

    setPriceComparison({
      comparisons,
      cheapest: comparisons[0],
      mostExpensive: comparisons[comparisons.length - 1],
      savings: comparisons[comparisons.length - 1].total - comparisons[0].total
    })

    setIsLoading(false)
  }

  // ==========================================
  // FUNCIONES PARA WHATSAPP
  // ==========================================

  const shareToWhatsApp = async (includePrice = false) => {
    const url = `${window.location.origin}/list/${currentList.access_code}`
    const pendingItems = items.filter(i => !i.completed)

    let text = `🛒 *${currentList.name}*\n\n`
    text += `📋 Productos pendientes (${pendingItems.length}):\n\n`

    // Agrupar por categoría
    const grouped = pendingItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})

    // Iconos por categoría
    const categoryIcons = {
      'Frutas y Verduras': '🥬',
      'Carnes': '🥩',
      'Pescados y Mariscos': '🐟',
      'Lácteos': '🥛',
      'Panadería': '🥖',
      'Bebidas': '🥤',
      'Despensa': '🏺',
      'Congelados': '🧊',
      'Limpieza': '🧹',
      'Higiene Personal': '🧴',
      'Snacks y Dulces': '🍫',
      'Mascotas': '🐾',
      'Otros': '📦'
    }

    Object.entries(grouped).forEach(([category, categoryItems]) => {
      const icon = categoryIcons[category] || '📦'
      text += `*${icon} ${category}*\n`
      categoryItems.forEach(item => {
        text += `  • ${item.name}`
        if (item.quantity > 1 || item.unit !== 'unidad') {
          text += ` (${item.quantity} ${item.unit})`
        }
        text += '\n'
      })
      text += '\n'
    })

    if (includePrice && priceComparison) {
      text += `💰 *Mejor precio:* ${priceComparison.cheapest.supermarket.name} - ${priceComparison.cheapest.total.toFixed(2)}€\n\n`
    }

    text += `🔗 Unirse: ${url}`

    // Intentar Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentList.name,
          text: text
        })
        showNotification('¡Compartido!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackWhatsAppShare(text)
        }
      }
    } else {
      fallbackWhatsAppShare(text)
    }
  }

  const fallbackWhatsAppShare = (text) => {
    const encodedText = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
    showNotification('Abriendo WhatsApp...')
  }

  // ==========================================
  // FUNCIONES PARA FAVORITOS
  // ==========================================

  const loadFavorites = async () => {
    if (!currentList) return

    const { data, error } = await supabase
      .from('favorite_products')
      .select('*')
      .eq('list_id', currentList.id)
      .order('use_count', { ascending: false })

    if (data && !error) {
      setFavorites(data)
    }
  }

  const toggleFavorite = async (item) => {
    // Verificar si ya es favorito
    const { data: existing } = await supabase
      .from('favorite_products')
      .select('id')
      .eq('list_id', currentList.id)
      .eq('name', item.name)
      .single()

    if (existing) {
      // Eliminar de favoritos
      await supabase
        .from('favorite_products')
        .delete()
        .eq('id', existing.id)

      showNotification('Eliminado de favoritos')
    } else {
      // Añadir a favoritos
      await supabase
        .from('favorite_products')
        .insert([{
          list_id: currentList.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          use_count: 0
        }])

      showNotification('¡Añadido a favoritos!', 'success')
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } })
    }

    loadFavorites()
  }

  const addFromFavorite = async (favorite) => {
    // Añadir a la lista
    const { error } = await supabase
      .from('shopping_items')
      .insert([{
        list_id: currentList.id,
        name: favorite.name,
        quantity: favorite.quantity,
        unit: favorite.unit,
        category: favorite.category,
        completed: false
      }])

    if (!error) {
      // Incrementar contador de uso
      await supabase.rpc('increment_favorite_use', { p_favorite_id: favorite.id })

      showNotification(`${favorite.name} añadido`)
      loadFavorites()
    }
  }

  const isFavorite = (itemName) => {
    return favorites.some(f => f.name === itemName)
  }

  // ==========================================
  // FUNCIONES PARA MODO COMPRA
  // ==========================================

  const toggleShoppingMode = async () => {
    if (!currentList) return

    const newMode = !shoppingMode
    setShoppingMode(newMode)

    // Guardar en BD
    const { data: existing } = await supabase
      .from('list_settings')
      .select('id')
      .eq('list_id', currentList.id)
      .single()

    if (existing) {
      await supabase
        .from('list_settings')
        .update({ shopping_mode_enabled: newMode })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('list_settings')
        .insert([{
          list_id: currentList.id,
          shopping_mode_enabled: newMode
        }])
    }

    showNotification(newMode ? 'Modo compra activado' : 'Modo normal', 'success')
  }

  const loadListSettings = async () => {
    if (!currentList) return

    const { data } = await supabase
      .from('list_settings')
      .select('*')
      .eq('list_id', currentList.id)
      .single()

    if (data) {
      setShoppingMode(data.shopping_mode_enabled)
    }
  }

  // Cargar lista desde URL al montar
  useEffect(() => {
    const pathname = window.location.pathname
    const match = pathname.match(/^\/list\/([A-Z0-9]{6})$/i)

    if (match) {
      const code = match[1].toUpperCase()
      const loadListFromUrl = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('shopping_lists')
          .select('*')
          .eq('access_code', code)
          .single()

        if (data && !error) {
          setCurrentList(data)
          setAccessCode(code)
          setView('list')
        } else {
          showNotification('Lista no encontrada', 'error')
          navigate('/')
        }
        setIsLoading(false)
      }
      loadListFromUrl()
    } else if (pathname === '/') {
      setView('home')
    }
  }, [])

  // Cargar supermercados al inicio
  useEffect(() => {
    loadSupermarkets()
  }, [])

  // Sincronizar view con URL
  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === '/' && view !== 'home') {
      setView('home')
      setCurrentList(null)
      setItems([])
    }
  }, [window.location.pathname])

  useEffect(() => {
    if (!currentList) return
    const fetchItems = async () => {
      const { data } = await supabase.from('shopping_items').select('*').eq('list_id', currentList.id).order('created_at', { ascending: false })
      if (data) setItems(data)
    }
    fetchItems()
    loadFavorites()
    loadListSettings()
    const channel = supabase.channel(`list-${currentList.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_items', filter: `list_id=eq.${currentList.id}` }, (payload) => {
        // Ignorar eventos propios (< 2 segundos)
        const eventTime = new Date(payload.new?.updated_at || payload.commit_timestamp)
        if (Date.now() - eventTime < 2000) {
          return // Probablemente nuestro cambio
        }

        // Procesar eventos externos
        if (payload.eventType === 'INSERT') setItems(prev => [payload.new, ...prev])
        else if (payload.eventType === 'UPDATE') setItems(prev => prev.map(item => item.id === payload.new.id ? payload.new : item))
        else if (payload.eventType === 'DELETE') setItems(prev => prev.filter(item => item.id !== payload.old.id))
      })
      .on('presence', { event: 'sync' }, () => { setActiveUsers(Object.keys(channel.presenceState()).length) })
      .subscribe(async (status) => { if (status === 'SUBSCRIBED') await channel.track({ user: Date.now() }) })
    return () => { supabase.removeChannel(channel) }
  }, [currentList])

  const filteredItems = items
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .filter(item => shoppingMode ? !item.completed : true) // En modo compra, ocultar completados
  const groupedItems = filteredItems.reduce((acc, item) => { if (!acc[item.category]) acc[item.category] = []; acc[item.category].push(item); return acc }, {})
  const sortedItems = [...filteredItems].sort((a, b) => { if (a.completed !== b.completed) return a.completed ? 1 : -1; return new Date(b.created_at) - new Date(a.created_at) })
  const activeCategories = [...new Set(items.map(item => item.category))]
  const totalItems = items.length
  const completedCount = items.filter(i => i.completed).length
  const pendingItems = totalItems - completedCount
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'}`}>
            <div className="flex items-center gap-2">{notification.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}{notification.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'home' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 mb-6 shadow-2xl shadow-violet-500/30">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">ListaCompra</span>
            </h1>
            <p className="text-lg text-white/50">Listas compartidas en tiempo real</p>
          </motion.div>

          <div className="w-full max-w-md space-y-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-400" />Crear nueva lista</h2>
              <input type="text" placeholder="Nombre de la lista" value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && createList()}
                className="w-full px-4 py-3 mb-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 placeholder:text-white/30" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createList} disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" />Crear lista</>}
              </motion.button>
            </motion.div>

            <div className="flex items-center gap-4"><div className="flex-1 h-px bg-white/20" /><span className="text-white/30 text-sm">o</span><div className="flex-1 h-px bg-white/20" /></div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Share2 className="w-5 h-5 text-emerald-400" />Unirse a lista</h2>
              <input type="text" placeholder="Código (6 caracteres)" value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} onKeyPress={(e) => e.key === 'Enter' && joinList()} maxLength={6}
                className="w-full px-4 py-3 mb-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none uppercase tracking-widest text-center text-xl font-mono placeholder:text-white/30" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={joinList} disabled={isLoading || accessCode.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" />Unirse</>}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {view === 'list' && currentList && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen">
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { navigate('/'); setCurrentList(null); setItems([]) }}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"><Home className="w-5 h-5" /></motion.button>
                  <div>
                    <h1 className="text-xl font-bold">{currentList.name}</h1>
                    {activeUsers > 1 && <div className="flex items-center gap-1 text-sm text-white/50"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{activeUsers} online</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyCode}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-sm hover:bg-white/10">
                    {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="font-mono tracking-wider">{currentList.access_code}</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { loadPriceComparison(); setShowPriceComparison(true); }}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10" title="Comparar precios">
                    <TrendingDown className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => shareToWhatsApp(false)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center" title="Compartir por WhatsApp">
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFavorites(true)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10" title="Favoritos">
                    <Star className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadStats}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"><BarChart3 className="w-5 h-5" /></motion.button>
                </div>
              </div>

              {/* Toggle modo compra */}
              <div className="flex items-center gap-2 mb-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleShoppingMode}
                  className={`flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${shoppingMode ? 'bg-gradient-to-r from-emerald-600 to-green-600' : 'bg-white/5 hover:bg-white/10'}`}>
                  {shoppingMode ? <Check className="w-4 h-4" /> : <ShoppingBasket className="w-4 h-4" />}
                  {shoppingMode ? 'Modo Compra Activo' : 'Activar Modo Compra'}
                </motion.button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2"><span className="text-white/50">{pendingItems} pendientes</span><span className="text-emerald-400">{completedCount} completados</span></div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
              </div>

              <form onSubmit={addItem} className="flex gap-2">
                <input ref={inputRef} type="text" placeholder="Añadir producto..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 placeholder:text-white/30" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg"><Plus className="w-6 h-6" /></motion.button>
              </form>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex bg-white/5 rounded-xl p-1">
                  <button onClick={() => setViewMode('compact')} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${viewMode === 'compact' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    <List className="w-4 h-4" /><span className="hidden sm:inline">Lista</span>
                  </button>
                  <button onClick={() => setViewMode('category')} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${viewMode === 'category' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    <LayoutGrid className="w-4 h-4" /><span className="hidden sm:inline">Categorías</span>
                  </button>
                </div>
                <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap ${filterCategory === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>Todos</button>
                  {activeCategories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex items-center gap-1 ${filterCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>
                      <span>{CATEGORY_ICONS[cat]}</span><span className="hidden sm:inline">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
            {filteredItems.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4"><Package className="w-10 h-10 text-white/20" /></div>
                <h3 className="text-xl font-semibold mb-2">Lista vacía</h3><p className="text-white/50">Añade tu primer producto</p>
              </motion.div>
            ) : viewMode === 'compact' ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {sortedItems.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      className={`group flex items-center gap-3 p-3 rounded-xl border ${item.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleComplete(item)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white/10'}`}>
                        {item.completed ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4 text-white/30" />}
                      </motion.button>
                      <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`font-medium truncate ${item.completed ? 'line-through text-white/50' : ''}`}>{item.name}</span>
                        {formatQuantity(item.quantity, item.unit) && <span className="ml-2 text-sm text-white/40">{formatQuantity(item.quantity, item.unit)}</span>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite(item)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${isFavorite(item.name) ? 'text-yellow-400' : 'bg-white/5 hover:bg-yellow-500/20'}`}>
                          <Star className={`w-3.5 h-3.5 ${isFavorite(item.name) ? 'fill-yellow-400' : ''}`} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingItem(item)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-violet-500/20 hover:text-violet-400"><Edit3 className="w-3.5 h-3.5" /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteItem(item.id)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                      <h2 className="text-lg font-semibold">{category}</h2>
                      <span className="text-white/30 text-sm">({categoryItems.length})</span>
                    </div>
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <motion.div key={item.id} layout className={`group flex items-center gap-3 p-4 rounded-2xl border ${item.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleComplete(item)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white/10'}`}>
                            {item.completed ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5 text-white/30" />}
                          </motion.button>
                          <div className="flex-1">
                            <span className={`font-medium ${item.completed ? 'line-through text-white/50' : ''}`}>{item.name}</span>
                            {formatQuantity(item.quantity, item.unit) && <span className="ml-2 text-sm text-white/50">{formatQuantity(item.quantity, item.unit)}</span>}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => toggleFavorite(item)} className={`w-8 h-8 rounded-xl flex items-center justify-center ${isFavorite(item.name) ? 'text-yellow-400' : 'bg-white/5 hover:bg-yellow-500/20'}`}>
                              <Star className={`w-4 h-4 ${isFavorite(item.name) ? 'fill-yellow-400' : ''}`} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setEditingItem(item)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-violet-500/20"><Edit3 className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteItem(item.id)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>

          {completedCount > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] to-transparent">
              <div className="max-w-2xl mx-auto">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={clearCompleted}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10">
                  <ListChecks className="w-5 h-5" />Limpiar {completedCount} completados
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {view === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen">
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setView('list')}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowRight className="w-5 h-5 rotate-180" /></motion.button>
                <div><h1 className="text-xl font-bold">Estadísticas</h1><p className="text-sm text-white/50">Patrones de compra</p></div>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20">
                    <TrendingUp className="w-6 h-6 text-violet-400 mb-2" /><div className="text-3xl font-bold">{stats.totalPurchases}</div><div className="text-sm text-white/50">Compras totales</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
                    <Calendar className="w-6 h-6 text-emerald-400 mb-2" /><div className="text-xl font-bold">{stats.mostActiveDay}</div><div className="text-sm text-white/50">Día más activo</div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-violet-400" />Top productos</h3>
                  <div className="space-y-3">
                    {stats.topProducts.length > 0 ? stats.topProducts.map(([name, count], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium">{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1"><span className="font-medium">{name}</span><span className="text-white/50">{count}x</span></div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.topProducts[0][1]) * 100}%` }} className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )) : <p className="text-white/50 text-center py-4">Aún no hay datos</p>}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-emerald-400" />Categorías</h3>
                  <div className="space-y-3">
                    {stats.categoryStats.length > 0 ? stats.categoryStats.map(([category, count]) => (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1"><span className="font-medium">{category}</span><span className="text-white/50">{count}</span></div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.categoryStats[0][1]) * 100}%` }} className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[category]} rounded-full`} />
                          </div>
                        </div>
                      </div>
                    )) : <p className="text-white/50 text-center py-4">Aún no hay datos</p>}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-cyan-400" />Patrón semanal</h3>
                  <div className="flex justify-between items-end h-32">
                    {stats.dayNames.map((day, i) => {
                      const count = stats.dayOfWeekCounts[i] || 0
                      const maxCount = Math.max(...Object.values(stats.dayOfWeekCounts)) || 1
                      const height = (count / maxCount) * 100
                      return (
                        <div key={day} className="flex flex-col items-center gap-2 flex-1">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(height, 5)}%` }}
                            className={`w-8 rounded-t-lg ${i === new Date().getDay() ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' : 'bg-white/20'}`} />
                          <span className="text-xs text-white/50">{day}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </>
            ) : null}
          </main>
        </motion.div>
      )}

      {/* Paneles flotantes */}
      <AnimatePresence>
        <PriceComparisonPanel
          show={showPriceComparison}
          onClose={() => setShowPriceComparison(false)}
          priceComparison={priceComparison}
          onShare={() => shareToWhatsApp(true)}
        />
        <FavoritesView
          show={showFavorites}
          onClose={() => setShowFavorites(false)}
          favorites={favorites}
          onAdd={addFromFavorite}
          searchTerm={favoriteSearchTerm}
          setSearchTerm={setFavoriteSearchTerm}
        />
        {editingItem && <EditModal item={editingItem} onSave={updateItem} onClose={() => setEditingItem(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default App
