import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, Check, Share2, BarChart3,
  Copy, Package, TrendingUp,
  Sparkles, X, Calendar,
  PieChart, ArrowRight, Loader2, CheckCircle2, Circle,
  ListChecks, Home, Edit3, Save, List, LayoutGrid,
  Star, Search, Moon, Sun, Wand2, ClipboardList
} from 'lucide-react'
import confetti from 'canvas-confetti'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// CATEGORÍAS
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
  'Viaje': ['maleta','mochila','pasaporte','cargador','adaptador','protector solar','gafas de sol','gafas','bañador','bikini','toalla','chanclas','sandalias','neceser','candado','almohada viaje','tapones oídos','antifaz','botiquín','tiritas','ibuprofeno','paracetamol','repelente','crema solar','desodorante viaje','cepillo viaje','mini champú','ropa interior','calcetines','camiseta','pantalón','chaqueta','impermeable','paraguas','mapa','guía','documentos','seguro viaje','tarjeta','dinero','monedero'],
  'Fiesta': ['vasos','platos','servilletas','mantel','globos','guirnaldas','velas','tarta','pastel','refrescos','hielo','snacks','patatas','aceitunas','decoración','confeti','gorros','cotillón','altavoz','luces','pajitas','cubiertos desechables','bolsas regalo','piñata','invitaciones'],
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
  'Snacks y Dulces': '🍫', 'Mascotas': '🐾', 'Viaje': '🧳', 'Fiesta': '🎉', 'Otros': '📦'
}

const CATEGORY_COLORS = {
  'Frutas y Verduras': 'from-emerald-500 to-green-600',
  'Carnes': 'from-red-500 to-rose-600',
  'Pescados y Mariscos': 'from-cyan-500 to-blue-600',
  'Lácteos': 'from-amber-400 to-yellow-500',
  'Panadería': 'from-orange-400 to-amber-500',
  'Bebidas': 'from-green-500 to-emerald-600',
  'Despensa': 'from-stone-500 to-zinc-600',
  'Congelados': 'from-sky-400 to-cyan-500',
  'Limpieza': 'from-teal-500 to-emerald-600',
  'Higiene Personal': 'from-pink-500 to-rose-500',
  'Snacks y Dulces': 'from-lime-500 to-pink-600',
  'Mascotas': 'from-lime-500 to-green-500',
  'Viaje': 'from-blue-500 to-indigo-600',
  'Fiesta': 'from-purple-500 to-pink-500',
  'Otros': 'from-slate-500 to-gray-600'
}

const ALL_CATEGORIES = Object.keys(CATEGORY_ICONS)
const UNITS = ['unidad', 'kg', 'g', 'L', 'ml', 'docena', 'paquete', 'lata', 'botella', 'bolsa', 'bote', 'tarrina', 'bandeja', 'manojo', 'racimo']

// MODAL DE EDICIÓN
function EditModal({ item, onSave, onClose, theme = {} }) {
  const [name, setName] = useState(item.name)
  const [quantity, setQuantity] = useState(item.quantity || 1)
  const [unit, setUnit] = useState(item.unit || 'unidad')
  const [category, setCategory] = useState(item.category)
  const [isLoading, setIsLoading] = useState(false)

  const { bgCard = 'bg-[#1e1e1e]', bgInput = 'bg-[#2a2a2a]', text = 'text-[#e0e0e0]', textMuted = 'text-[#a0a0a0]', border = 'border-white/10', bgHover = 'hover:bg-[#2a2a2a]' } = theme

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
        className={`${bgCard} rounded-3xl p-6 w-full max-w-md border ${border} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${text}`}>
            <Edit3 className="w-5 h-5 text-emerald-400" />Editar elemento
          </h2>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text}`}><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`text-sm ${textMuted} mb-1 block`}>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none focus:border-emerald-500/50 ${text}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-sm ${textMuted} mb-1 block`}>Cantidad</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQuantity(Math.max(0.5, quantity - (quantity <= 1 ? 0.5 : 1)))}
                  className={`w-10 h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} text-lg font-bold ${text}`}>-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  step="0.5" min="0.5" className={`flex-1 px-3 py-2 ${bgInput} border ${border} rounded-xl text-center focus:outline-none ${text}`} />
                <button type="button" onClick={() => setQuantity(quantity + 1)}
                  className={`w-10 h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} text-lg font-bold ${text}`}>+</button>
              </div>
            </div>
            <div>
              <label className={`text-sm ${textMuted} mb-1 block`}>Unidad</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}
                className={`w-full px-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none appearance-none cursor-pointer ${text}`}>
                {UNITS.map(u => <option key={u} value={u} className={bgCard}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={`text-sm ${textMuted} mb-1 block`}>Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none appearance-none cursor-pointer ${text}`}>
              {ALL_CATEGORIES.map(cat => <option key={cat} value={cat} className={bgCard}>{CATEGORY_ICONS[cat]} {cat}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={`flex-1 py-3 px-6 ${bgInput} rounded-2xl font-medium ${bgHover} ${text}`}>Cancelar</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            disabled={isLoading || !name.trim()} className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" />Guardar</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// MODAL DE GENERACIÓN IA
function AIGenerateModal({ show, onClose, onGenerate, theme = {} }) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const { bgCard = 'bg-[#1e1e1e]', bgInput = 'bg-[#2a2a2a]', text = 'text-[#e0e0e0]', textMuted = 'text-[#a0a0a0]', border = 'border-white/10', bgHover = 'hover:bg-[#2a2a2a]' } = theme

  const examples = [
    { label: 'Viaje 3 días', prompt: 'Lista de cosas para un viaje de una persona de 3 días' },
    { label: 'Fiesta 10 personas', prompt: 'Lista para organizar una fiesta de cumpleaños para 10 personas' },
    { label: 'Compra semanal', prompt: 'Lista de la compra semanal para una familia de 4 personas' },
    { label: 'Mudanza', prompt: 'Lista de cosas necesarias para una mudanza' },
    { label: 'Camping', prompt: 'Lista de equipamiento para un fin de semana de camping' },
    { label: 'Bebé recién nacido', prompt: 'Lista de cosas esenciales para un bebé recién nacido' },
  ]

  if (!show) return null

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError('')
    try {
      await onGenerate(prompt)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al generar la lista')
    }
    setIsGenerating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className={`${bgCard} rounded-3xl p-6 w-full max-w-lg border ${border} shadow-2xl max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${text}`}>
            <Wand2 className="w-5 h-5 text-purple-400" />Generar lista con IA
          </h2>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text}`}><X className="w-4 h-4" /></button>
        </div>

        <p className={`text-sm ${textMuted} mb-4`}>
          Describe qué tipo de lista necesitas y la IA generará los elementos automáticamente.
        </p>

        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Lista de la compra semanal para 2 personas..."
            rows={3}
            className={`w-full px-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none focus:border-purple-500/50 ${text} placeholder:${textMuted} resize-none`}
          />
        </div>

        <div className="mb-4">
          <p className={`text-xs ${textMuted} mb-2`}>Ideas rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPrompt(ex.prompt)}
                className={`px-3 py-1.5 rounded-xl text-xs ${bgInput} ${bgHover} ${text} border ${border} transition-all`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className={`flex-1 py-3 px-6 ${bgInput} rounded-2xl font-medium ${bgHover} ${text}`}>Cancelar</button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Generando...</>
            ) : (
              <><Wand2 className="w-5 h-5" />Generar</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// VISTA DE FAVORITOS
function FavoritesView({ show, onClose, favorites, onAdd, searchTerm, setSearchTerm, theme = {} }) {
  if (!show) return null

  const { bgCard = 'bg-[#1e1e1e]', bgInput = 'bg-[#2a2a2a]', text = 'text-[#e0e0e0]', textMuted = 'text-[#a0a0a0]', border = 'border-white/10', bgHover = 'hover:bg-[#2a2a2a]' } = theme

  const filteredFavorites = favorites.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-2xl max-h-[90vh] ${bgCard} backdrop-blur-xl rounded-3xl border ${border} overflow-hidden flex flex-col`}>
        <div className={`p-6 border-b ${border}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${text}`}>
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              Favoritos
            </h2>
            <button onClick={onClose} className={`w-10 h-10 rounded-xl ${bgInput} ${bgHover} flex items-center justify-center ${text}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
            <input type="text" placeholder="Buscar favorito..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none focus:border-emerald-500/50 ${text} placeholder:${textMuted}`} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((fav, index) => (
                <motion.div key={fav.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl ${bgInput} border ${border} ${bgHover} transition-colors`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{CATEGORY_ICONS[fav.category] || '📦'}</span>
                      <div>
                        <div className={`font-semibold ${text}`}>{fav.name}</div>
                        <div className={`text-sm ${textMuted}`}>{fav.quantity} {fav.unit}</div>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs ${textMuted}`}>Usado {fav.use_count} {fav.use_count === 1 ? 'vez' : 'veces'}</span>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(fav)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 text-white text-sm font-semibold flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Añadir
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center h-full ${textMuted}`}>
              <Star className="w-16 h-16 mb-4" />
              <p className="text-lg">No hay favoritos aún</p>
              <p className="text-sm">Marca elementos con la estrella para acceso rápido</p>
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

  // Estados para modo compra
  const [shoppingMode, setShoppingMode] = useState(false)

  // Estados para favoritos
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [favoriteSearchTerm, setFavoriteSearchTerm] = useState('')

  // Estado para modal IA
  const [showAIModal, setShowAIModal] = useState(false)

  // Estado para tema (dark/light) - dark por defecto
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })

  // Guardar tema en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Clases de tema dinámicas
  const isDark = theme === 'dark'
  const bg = isDark ? 'bg-[#121212]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const bgInput = isDark ? 'bg-[#2a2a2a]' : 'bg-white'
  const bgHover = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const text = isDark ? 'text-[#e0e0e0]' : 'text-gray-900'
  const textMuted = isDark ? 'text-[#a0a0a0]' : 'text-gray-500'
  const border = isDark ? 'border-white/10' : 'border-gray-300'
  const bgHeader = isDark ? 'bg-[#121212]/80' : 'bg-gray-50/95'

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
    setView('list')
    setIsLoading(false)
    navigate(`/list/${code}`)
    showNotification('¡Lista creada!')
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    // Mostrar modal de IA después de crear
    setTimeout(() => setShowAIModal(true), 500)
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

  // ==========================================
  // GENERACIÓN CON IA (Groq - gratis)
  // ==========================================

  const generateWithAI = async (prompt) => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY

    if (!groqKey) {
      // Fallback: generación local inteligente
      return generateLocalList(prompt)
    }

    const systemPrompt = `Eres un asistente experto en generar listas prácticas. El usuario describirá qué necesita y tú generarás la lista EXACTA para ese propósito.

IMPORTANTE: Genera elementos específicos para lo que pide el usuario. Si pide una lista de viaje, genera cosas de viaje (ropa, documentos, accesorios). Si pide una lista de fiesta, genera cosas de fiesta. Si pide lista de compra, genera alimentos. NO mezcles tipos.

Responde ÚNICAMENTE con un JSON array válido, sin markdown, sin explicaciones, sin backticks. Cada objeto:
- "name": nombre del elemento en español (string)
- "quantity": cantidad numérica (number, mínimo 1)
- "unit": unidad (string, una de: unidad, kg, g, L, ml, docena, paquete, lata, botella, bolsa, bote, bandeja)

Genera entre 12 y 25 elementos. Sé práctico, específico y realista. Adapta cantidades al número de personas si se indica.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Genera una lista para: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || 'Error al conectar con la IA')
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Extraer JSON del response (buscar array incluso si viene envuelto en markdown)
    const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('La IA no generó una respuesta válida. Intenta de nuevo.')

    let generatedItems
    try {
      generatedItems = JSON.parse(jsonMatch[0])
    } catch {
      throw new Error('Error al procesar la respuesta de la IA. Intenta de nuevo.')
    }

    if (!Array.isArray(generatedItems) || generatedItems.length === 0) {
      throw new Error('La IA no generó elementos. Intenta con otra descripción.')
    }

    await addGeneratedItems(generatedItems)
  }

  const generateLocalList = async (prompt) => {
    const promptLower = prompt.toLowerCase()

    // Templates inteligentes basados en keywords
    const templates = {
      viaje: [
        { name: 'Ropa interior', quantity: 4, unit: 'unidad' },
        { name: 'Calcetines', quantity: 4, unit: 'unidad' },
        { name: 'Camisetas', quantity: 3, unit: 'unidad' },
        { name: 'Pantalón', quantity: 2, unit: 'unidad' },
        { name: 'Cargador móvil', quantity: 1, unit: 'unidad' },
        { name: 'Neceser', quantity: 1, unit: 'unidad' },
        { name: 'Cepillo de dientes', quantity: 1, unit: 'unidad' },
        { name: 'Pasta de dientes', quantity: 1, unit: 'unidad' },
        { name: 'Champú mini', quantity: 1, unit: 'unidad' },
        { name: 'Desodorante', quantity: 1, unit: 'unidad' },
        { name: 'Protector solar', quantity: 1, unit: 'unidad' },
        { name: 'Gafas de sol', quantity: 1, unit: 'unidad' },
        { name: 'Documentos/DNI', quantity: 1, unit: 'unidad' },
        { name: 'Medicamentos básicos', quantity: 1, unit: 'unidad' },
        { name: 'Adaptador enchufe', quantity: 1, unit: 'unidad' },
        { name: 'Botella de agua', quantity: 1, unit: 'unidad' },
      ],
      fiesta: [
        { name: 'Refrescos variados', quantity: 10, unit: 'botella' },
        { name: 'Cervezas', quantity: 2, unit: 'paquete' },
        { name: 'Hielo', quantity: 3, unit: 'bolsa' },
        { name: 'Patatas fritas', quantity: 4, unit: 'bolsa' },
        { name: 'Nachos', quantity: 2, unit: 'bolsa' },
        { name: 'Aceitunas', quantity: 2, unit: 'bote' },
        { name: 'Servilletas', quantity: 2, unit: 'paquete' },
        { name: 'Vasos desechables', quantity: 1, unit: 'paquete' },
        { name: 'Platos desechables', quantity: 1, unit: 'paquete' },
        { name: 'Globos', quantity: 1, unit: 'paquete' },
        { name: 'Guirnaldas', quantity: 2, unit: 'unidad' },
        { name: 'Tarta', quantity: 1, unit: 'unidad' },
        { name: 'Velas', quantity: 1, unit: 'paquete' },
        { name: 'Pizza', quantity: 3, unit: 'unidad' },
        { name: 'Embutido variado', quantity: 500, unit: 'g' },
        { name: 'Queso', quantity: 300, unit: 'g' },
      ],
      compra: [
        { name: 'Leche', quantity: 2, unit: 'L' },
        { name: 'Pan', quantity: 1, unit: 'unidad' },
        { name: 'Huevos', quantity: 1, unit: 'docena' },
        { name: 'Pollo', quantity: 1, unit: 'kg' },
        { name: 'Arroz', quantity: 1, unit: 'kg' },
        { name: 'Pasta', quantity: 500, unit: 'g' },
        { name: 'Tomate frito', quantity: 2, unit: 'bote' },
        { name: 'Aceite de oliva', quantity: 1, unit: 'botella' },
        { name: 'Manzanas', quantity: 1, unit: 'kg' },
        { name: 'Plátanos', quantity: 6, unit: 'unidad' },
        { name: 'Lechuga', quantity: 1, unit: 'unidad' },
        { name: 'Tomates', quantity: 1, unit: 'kg' },
        { name: 'Yogures', quantity: 1, unit: 'paquete' },
        { name: 'Queso fresco', quantity: 1, unit: 'unidad' },
        { name: 'Papel higiénico', quantity: 1, unit: 'paquete' },
        { name: 'Jabón lavavajillas', quantity: 1, unit: 'botella' },
        { name: 'Detergente ropa', quantity: 1, unit: 'botella' },
        { name: 'Agua mineral', quantity: 6, unit: 'botella' },
      ],
      mudanza: [
        { name: 'Cajas de cartón grandes', quantity: 10, unit: 'unidad' },
        { name: 'Cajas de cartón medianas', quantity: 15, unit: 'unidad' },
        { name: 'Cinta de embalar', quantity: 3, unit: 'unidad' },
        { name: 'Plástico de burbujas', quantity: 2, unit: 'unidad' },
        { name: 'Rotuladores permanentes', quantity: 3, unit: 'unidad' },
        { name: 'Etiquetas adhesivas', quantity: 1, unit: 'paquete' },
        { name: 'Bolsas de basura grandes', quantity: 1, unit: 'paquete' },
        { name: 'Papel de periódico', quantity: 1, unit: 'paquete' },
        { name: 'Tijeras', quantity: 2, unit: 'unidad' },
        { name: 'Cúter', quantity: 2, unit: 'unidad' },
        { name: 'Guantes de trabajo', quantity: 2, unit: 'unidad' },
        { name: 'Herramientas básicas', quantity: 1, unit: 'unidad' },
        { name: 'Fundas para colchón', quantity: 1, unit: 'unidad' },
        { name: 'Candados', quantity: 2, unit: 'unidad' },
      ],
      camping: [
        { name: 'Tienda de campaña', quantity: 1, unit: 'unidad' },
        { name: 'Saco de dormir', quantity: 1, unit: 'unidad' },
        { name: 'Esterilla', quantity: 1, unit: 'unidad' },
        { name: 'Linterna', quantity: 1, unit: 'unidad' },
        { name: 'Pilas extra', quantity: 1, unit: 'paquete' },
        { name: 'Mechero/cerillas', quantity: 2, unit: 'unidad' },
        { name: 'Navaja multiusos', quantity: 1, unit: 'unidad' },
        { name: 'Botella de agua', quantity: 2, unit: 'L' },
        { name: 'Protector solar', quantity: 1, unit: 'unidad' },
        { name: 'Repelente insectos', quantity: 1, unit: 'unidad' },
        { name: 'Botiquín', quantity: 1, unit: 'unidad' },
        { name: 'Comida enlatada', quantity: 4, unit: 'lata' },
        { name: 'Snacks y frutos secos', quantity: 3, unit: 'bolsa' },
        { name: 'Papel higiénico', quantity: 2, unit: 'unidad' },
        { name: 'Bolsas de basura', quantity: 1, unit: 'paquete' },
        { name: 'Hornillo portátil', quantity: 1, unit: 'unidad' },
      ],
      bebe: [
        { name: 'Pañales recién nacido', quantity: 2, unit: 'paquete' },
        { name: 'Toallitas húmedas', quantity: 3, unit: 'paquete' },
        { name: 'Body manga corta', quantity: 6, unit: 'unidad' },
        { name: 'Body manga larga', quantity: 6, unit: 'unidad' },
        { name: 'Pijamas', quantity: 4, unit: 'unidad' },
        { name: 'Gorrito', quantity: 2, unit: 'unidad' },
        { name: 'Biberones', quantity: 3, unit: 'unidad' },
        { name: 'Chupetes', quantity: 2, unit: 'unidad' },
        { name: 'Crema del pañal', quantity: 1, unit: 'unidad' },
        { name: 'Gel baño bebé', quantity: 1, unit: 'unidad' },
        { name: 'Termómetro', quantity: 1, unit: 'unidad' },
        { name: 'Mantitas', quantity: 2, unit: 'unidad' },
        { name: 'Cuna o minicuna', quantity: 1, unit: 'unidad' },
        { name: 'Sábanas cuna', quantity: 3, unit: 'unidad' },
        { name: 'Muselinas', quantity: 4, unit: 'unidad' },
        { name: 'Leche de fórmula', quantity: 1, unit: 'bote' },
      ]
    }

    // Detectar tipo de lista
    let selectedTemplate = templates.compra // default
    if (promptLower.includes('viaje') || promptLower.includes('vacacion') || promptLower.includes('maleta')) {
      selectedTemplate = templates.viaje
    } else if (promptLower.includes('fiesta') || promptLower.includes('cumpleaños') || promptLower.includes('celebra')) {
      selectedTemplate = templates.fiesta
    } else if (promptLower.includes('mudanza') || promptLower.includes('mudar')) {
      selectedTemplate = templates.mudanza
    } else if (promptLower.includes('camping') || promptLower.includes('acampar') || promptLower.includes('campamento')) {
      selectedTemplate = templates.camping
    } else if (promptLower.includes('bebé') || promptLower.includes('bebe') || promptLower.includes('recién nacido') || promptLower.includes('embaraz')) {
      selectedTemplate = templates.bebe
    }

    await addGeneratedItems(selectedTemplate)
  }

  const addGeneratedItems = async (generatedItems) => {
    if (!currentList || !generatedItems.length) return

    for (const item of generatedItems) {
      const category = detectCategory(item.name)
      const { error } = await supabase
        .from('shopping_items')
        .insert([{
          list_id: currentList.id,
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'unidad',
          category,
          completed: false
        }])

      if (!error) {
        // No need for optimistic update - real-time will handle it
      }
    }

    showNotification(`${generatedItems.length} elementos añadidos`)
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
  }

  // ==========================================
  // CRUD ITEMS
  // ==========================================

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    const category = detectCategory(newItemName)
    const tempId = `temp-${Date.now()}`
    const newItem = {
      id: tempId,
      list_id: currentList.id,
      name: newItemName.trim(),
      quantity: 1,
      unit: 'unidad',
      category,
      completed: false,
      created_at: new Date().toISOString()
    }

    setItems(prev => [newItem, ...prev])
    setNewItemName('')
    inputRef.current?.focus()

    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([{
          list_id: currentList.id,
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          category: newItem.category,
          completed: false
        }])
        .select()
        .single()

      if (error) throw error
      setItems(prev => prev.map(item => item.id === tempId ? data : item))

      await supabase.from('purchase_history').insert([{
        list_id: currentList.id,
        item_name: newItem.name,
        category: newItem.category,
        action: 'added'
      }])
    } catch (error) {
      setItems(prev => prev.filter(item => item.id !== tempId))
      showNotification('Error al añadir', 'error')
      setNewItemName(newItem.name)
    }
  }

  const updateItem = async (updatedItem) => {
    const previousItems = [...items]
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
      setItems(previousItems)
      showNotification('Error al actualizar', 'error')
    }
  }

  const toggleComplete = async (item) => {
    const previousItems = [...items]
    const newCompleted = !item.completed

    setItems(prev => prev.map(i =>
      i.id === item.id
        ? { ...i, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
        : i
    ))

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

      if (newCompleted) {
        await supabase.from('purchase_history').insert([{
          list_id: currentList.id,
          item_name: item.name,
          category: item.category,
          action: 'purchased'
        }])
      }
    } catch (error) {
      setItems(previousItems)
      showNotification('Error al actualizar', 'error')
    }
  }

  const deleteItem = async (id) => {
    const previousItems = [...items]
    setItems(prev => prev.filter(item => item.id !== id))

    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
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
  // WHATSAPP SHARE
  // ==========================================

  const shareToWhatsApp = async () => {
    const url = `${window.location.origin}/list/${currentList.access_code}`
    const pendingItems = items.filter(i => !i.completed)

    let shareText = `📋 *${currentList.name}*\n\n`
    shareText += `Elementos pendientes (${pendingItems.length}):\n\n`

    const grouped = pendingItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})

    Object.entries(grouped).forEach(([category, categoryItems]) => {
      const icon = CATEGORY_ICONS[category] || '📦'
      shareText += `*${icon} ${category}*\n`
      categoryItems.forEach(item => {
        shareText += `  • ${item.name}`
        if (item.quantity > 1 || item.unit !== 'unidad') {
          shareText += ` (${item.quantity} ${item.unit})`
        }
        shareText += '\n'
      })
      shareText += '\n'
    })

    shareText += `🔗 Unirse: ${url}`

    if (navigator.share) {
      try {
        await navigator.share({ title: currentList.name, text: shareText })
        showNotification('¡Compartido!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          const encodedText = encodeURIComponent(shareText)
          window.open(`https://wa.me/?text=${encodedText}`, '_blank')
          showNotification('Abriendo WhatsApp...')
        }
      }
    } else {
      const encodedText = encodeURIComponent(shareText)
      window.open(`https://wa.me/?text=${encodedText}`, '_blank')
      showNotification('Abriendo WhatsApp...')
    }
  }

  // ==========================================
  // FAVORITOS
  // ==========================================

  const loadFavorites = async () => {
    if (!currentList) return
    const { data, error } = await supabase
      .from('favorite_products')
      .select('*')
      .eq('list_id', currentList.id)
      .order('use_count', { ascending: false })

    if (data && !error) setFavorites(data)
  }

  const toggleFavorite = async (item) => {
    const { data: existing } = await supabase
      .from('favorite_products')
      .select('id')
      .eq('list_id', currentList.id)
      .eq('name', item.name)
      .single()

    if (existing) {
      await supabase.from('favorite_products').delete().eq('id', existing.id)
      showNotification('Eliminado de favoritos')
    } else {
      await supabase.from('favorite_products').insert([{
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
      await supabase.rpc('increment_favorite_use', { p_favorite_id: favorite.id })
      showNotification(`${favorite.name} añadido`)
      loadFavorites()
    }
  }

  const isFavorite = (itemName) => favorites.some(f => f.name === itemName)

  // ==========================================
  // MODO COMPRA
  // ==========================================

  const toggleShoppingMode = async () => {
    if (!currentList) return
    const newMode = !shoppingMode
    setShoppingMode(newMode)

    const { data: existing } = await supabase.from('list_settings').select('id').eq('list_id', currentList.id).single()
    if (existing) {
      await supabase.from('list_settings').update({ shopping_mode_enabled: newMode }).eq('id', existing.id)
    } else {
      await supabase.from('list_settings').insert([{ list_id: currentList.id, shopping_mode_enabled: newMode }])
    }
    showNotification(newMode ? 'Modo compra activado' : 'Modo normal', 'success')
  }

  const loadListSettings = async () => {
    if (!currentList) return
    const { data } = await supabase.from('list_settings').select('*').eq('list_id', currentList.id).single()
    if (data) setShoppingMode(data.shopping_mode_enabled)
  }

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    const pathname = window.location.pathname
    const match = pathname.match(/^\/list\/([A-Z0-9]{6})$/i)
    if (match) {
      const code = match[1].toUpperCase()
      const loadListFromUrl = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.from('shopping_lists').select('*').eq('access_code', code).single()
        if (data && !error) {
          setCurrentList(data); setAccessCode(code); setView('list')
        } else {
          showNotification('Lista no encontrada', 'error'); navigate('/')
        }
        setIsLoading(false)
      }
      loadListFromUrl()
    } else if (pathname === '/') {
      setView('home')
    }
  }, [])

  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === '/' && view !== 'home') {
      setView('home'); setCurrentList(null); setItems([])
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
        if (payload.eventType === 'INSERT') {
          setItems(prev => {
            const exists = prev.some(item => item.id === payload.new.id)
            if (exists) return prev.map(item => item.id === payload.new.id ? payload.new : item)
            const eventTime = new Date(payload.new.created_at)
            if (Date.now() - eventTime < 1000) {
              const hasTempWithSameName = prev.some(item =>
                item.id.toString().startsWith('temp-') &&
                item.name === payload.new.name &&
                Math.abs(new Date(item.created_at) - eventTime) < 2000
              )
              if (hasTempWithSameName) return prev
            }
            return [payload.new, ...prev]
          })
        }
        else if (payload.eventType === 'UPDATE') {
          const eventTime = new Date(payload.new.updated_at || payload.commit_timestamp)
          if (Date.now() - eventTime < 2000) return
          setItems(prev => prev.map(item => item.id === payload.new.id ? payload.new : item))
        }
        else if (payload.eventType === 'DELETE') {
          setItems(prev => prev.filter(item => item.id !== payload.old.id))
        }
      })
      .on('presence', { event: 'sync' }, () => { setActiveUsers(Object.keys(channel.presenceState()).length) })
      .subscribe(async (status) => { if (status === 'SUBSCRIBED') await channel.track({ user: Date.now() }) })
    return () => { supabase.removeChannel(channel) }
  }, [currentList])

  const filteredItems = items
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .filter(item => shoppingMode ? !item.completed : true)
  const groupedItems = filteredItems.reduce((acc, item) => { if (!acc[item.category]) acc[item.category] = []; acc[item.category].push(item); return acc }, {})
  const sortedItems = [...filteredItems].sort((a, b) => { if (a.completed !== b.completed) return a.completed ? 1 : -1; return new Date(b.created_at) - new Date(a.created_at) })
  const activeCategories = [...new Set(items.map(item => item.category))]
  const totalItems = items.length
  const completedCount = items.filter(i => i.completed).length
  const pendingItems = totalItems - completedCount
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0

  const themeProps = { bgCard, bgInput, text, textMuted, border, bgHover }

  return (
    <div className={`min-h-screen ${bg} ${text} overflow-hidden transition-colors duration-300`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'}`}>
            <div className="flex items-center gap-2">{notification.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}{notification.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'home' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-600 mb-6 shadow-2xl shadow-emerald-500/30">
              <ClipboardList className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">ShopList</span>
            </h1>
            <p className={`text-lg ${textMuted}`}>Listas compartidas en tiempo real</p>
          </motion.div>

          {/* Theme toggle en home */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text} border ${border}`}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          <div className="w-full max-w-md space-y-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`${bgCard} backdrop-blur-xl rounded-3xl p-6 border ${border}`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${text}`}><Sparkles className="w-5 h-5 text-emerald-400" />Crear nueva lista</h2>
              <input type="text" placeholder="Nombre de la lista" value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && createList()}
                className={`w-full px-4 py-3 mb-3 ${bgInput} border ${border} rounded-2xl focus:outline-none focus:border-emerald-500/50 ${text} placeholder:${textMuted}`} />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createList} disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" />Crear lista</>}
              </motion.button>
            </motion.div>

            <div className="flex items-center gap-4"><div className={`flex-1 h-px ${border}`} /><span className={`${textMuted} text-sm`}>o</span><div className={`flex-1 h-px ${border}`} /></div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`${bgCard} backdrop-blur-xl rounded-3xl p-6 border ${border}`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${text}`}><Share2 className="w-5 h-5 text-emerald-400" />Unirse a lista</h2>
              <input type="text" placeholder="Código (6 caracteres)" value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} onKeyPress={(e) => e.key === 'Enter' && joinList()} maxLength={6}
                className={`w-full px-4 py-3 mb-3 ${bgInput} border ${border} rounded-2xl focus:outline-none uppercase tracking-widest text-center text-xl font-mono ${text} placeholder:${textMuted}`} />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={joinList} disabled={isLoading || accessCode.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" />Unirse</>}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {view === 'list' && currentList && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen">
          <header className={`sticky top-0 z-40 backdrop-blur-xl ${bgHeader} border-b ${border}`}>
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { navigate('/'); setCurrentList(null); setItems([]) }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text} border ${border}`} title="Volver al inicio">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <div className="min-w-0">
                    <h1 className={`text-base sm:text-xl font-bold ${text} truncate`}>{currentList.name}</h1>
                    {activeUsers > 1 && <div className={`flex items-center gap-1 text-xs sm:text-sm ${textMuted}`}><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{activeUsers} online</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyCode}
                    className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 ${bgInput} rounded-xl text-xs sm:text-sm ${bgHover} ${text} border ${border}`}>
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span className="font-mono tracking-wider text-xs">{currentList.access_code}</span>
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFavorites(true)}
                    className={`hidden sm:flex w-10 h-10 rounded-xl ${bgInput} items-center justify-center ${bgHover} ${text} border ${border}`} title="Favoritos">
                    <Star className="w-5 h-5" />
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareToWhatsApp}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-green-600/20" title="Compartir">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text} border ${border}`} title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}>
                    {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadStats}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text} border ${border}`} title="Estadísticas">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Toggle modo compra + botón IA */}
              <div className="flex items-center gap-2 mb-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleShoppingMode}
                  className={`flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${shoppingMode ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-600/20' : `${bgInput} ${bgHover} ${text} border ${border}`}`}>
                  {shoppingMode ? <Check className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />}
                  {shoppingMode ? 'Modo Compra Activo' : 'Activar Modo Compra'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAIModal(true)}
                  className="py-2 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20">
                  <Wand2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Generar con IA</span>
                  <span className="sm:hidden">IA</span>
                </motion.button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2"><span className={textMuted}>{pendingItems} pendientes</span><span className="text-emerald-400">{completedCount} completados</span></div>
                <div className={`h-2 ${bgInput} border ${border} rounded-full overflow-hidden`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
              </div>

              <div className="relative">
                <form onSubmit={addItem} className="flex gap-2">
                  <input ref={inputRef} type="text" placeholder="Añadir elemento..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                    className={`flex-1 px-4 py-3 ${bgInput} border ${border} rounded-2xl focus:outline-none focus:border-emerald-500/50 ${text} placeholder:${textMuted}`} />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white flex items-center justify-center shadow-lg"><Plus className="w-6 h-6" /></motion.button>
                </form>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className={`flex ${bgInput} rounded-xl p-1 border ${border}`}>
                  <button onClick={() => setViewMode('compact')} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${viewMode === 'compact' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : textMuted}`}>
                    <List className="w-4 h-4" /><span className="hidden sm:inline">Lista</span>
                  </button>
                  <button onClick={() => setViewMode('category')} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${viewMode === 'category' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : textMuted}`}>
                    <LayoutGrid className="w-4 h-4" /><span className="hidden sm:inline">Categorías</span>
                  </button>
                </div>
                <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap border ${filterCategory === 'all' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : `${bgInput} ${text} ${border}`}`}>Todos</button>
                  {activeCategories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex items-center gap-1 border ${filterCategory === cat ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : `${bgInput} ${text} ${border}`}`}>
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
                <div className={`w-20 h-20 rounded-3xl ${bgInput} flex items-center justify-center mx-auto mb-4`}><Package className={`w-10 h-10 ${textMuted}`} /></div>
                <h3 className={`text-xl font-semibold mb-2 ${text}`}>Lista vacía</h3>
                <p className={textMuted}>Añade tu primer elemento o genera una lista con IA</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAIModal(true)}
                  className="mt-4 py-2 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg inline-flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />Generar con IA
                </motion.button>
              </motion.div>
            ) : viewMode === 'compact' ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {sortedItems.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      className={`group flex items-center gap-3 p-3 rounded-xl border ${item.completed ? 'bg-emerald-500/10 border-emerald-500/20' : `${bgInput} ${border} ${bgHover}`}`}>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleComplete(item)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-emerald-500 text-white' : `${bgInput} border ${border}`}`}>
                        {item.completed ? <Check className="w-4 h-4" /> : <Circle className={`w-4 h-4 ${textMuted}`} />}
                      </motion.button>
                      <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-medium ${item.completed ? `line-through ${textMuted}` : text}`}>{item.name}</span>
                        </div>
                        {formatQuantity(item.quantity, item.unit) && <span className={`text-xs ${textMuted}`}>{formatQuantity(item.quantity, item.unit)}</span>}
                      </div>
                      <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite(item)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${isFavorite(item.name) ? 'text-yellow-400' : `${bgInput} hover:bg-yellow-500/20`}`}>
                          <Star className={`w-3.5 h-3.5 ${isFavorite(item.name) ? 'fill-yellow-400' : ''}`} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingItem(item)}
                          className={`w-7 h-7 rounded-lg ${bgInput} flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 ${text}`}><Edit3 className="w-3.5 h-3.5" /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteItem(item.id)}
                          className={`w-7 h-7 rounded-lg ${bgInput} flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 ${text}`}><Trash2 className="w-3.5 h-3.5" /></motion.button>
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
                      <h2 className={`text-lg font-semibold ${text}`}>{category}</h2>
                      <span className={`${textMuted} text-sm`}>({categoryItems.length})</span>
                    </div>
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <motion.div key={item.id} layout className={`group flex items-center gap-3 p-4 rounded-2xl border ${item.completed ? 'bg-emerald-500/10 border-emerald-500/20' : `${bgInput} ${border} ${bgHover}`}`}>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleComplete(item)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.completed ? 'bg-emerald-500 text-white' : `${bgInput} border ${border}`}`}>
                            {item.completed ? <Check className="w-5 h-5" /> : <Circle className={`w-5 h-5 ${textMuted}`} />}
                          </motion.button>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-medium ${item.completed ? `line-through ${textMuted}` : text}`}>{item.name}</span>
                            </div>
                            {formatQuantity(item.quantity, item.unit) && <span className={`text-xs ${textMuted}`}>{formatQuantity(item.quantity, item.unit)}</span>}
                          </div>
                          <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100">
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => toggleFavorite(item)} className={`w-8 h-8 rounded-xl flex items-center justify-center ${isFavorite(item.name) ? 'text-yellow-400' : `${bgInput} hover:bg-yellow-500/20`}`}>
                              <Star className={`w-4 h-4 ${isFavorite(item.name) ? 'fill-yellow-400' : ''}`} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setEditingItem(item)} className={`w-8 h-8 rounded-xl ${bgInput} flex items-center justify-center hover:bg-emerald-500/20 ${text}`}><Edit3 className="w-4 h-4" /></motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteItem(item.id)} className={`w-8 h-8 rounded-xl ${bgInput} flex items-center justify-center hover:bg-red-500/20 ${text}`}><Trash2 className="w-4 h-4" /></motion.button>
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
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className={`fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t ${isDark ? 'from-[#121212]' : 'from-gray-50'} to-transparent`}>
              <div className="max-w-2xl mx-auto">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={clearCompleted}
                  className={`w-full py-4 rounded-2xl ${bgCard} border ${border} flex items-center justify-center gap-2 ${bgHover} ${text}`}>
                  <ListChecks className="w-5 h-5" />Limpiar {completedCount} completados
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {view === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen">
          <header className={`sticky top-0 z-40 backdrop-blur-xl ${bgHeader} border-b ${border}`}>
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setView('list')}
                  className={`w-10 h-10 rounded-xl ${bgInput} flex items-center justify-center ${bgHover} ${text} border ${border}`}><ArrowRight className="w-5 h-5 rotate-180" /></motion.button>
                <div><h1 className={`text-xl font-bold ${text}`}>Estadísticas</h1><p className={`text-sm ${textMuted}`}>Patrones de uso</p></div>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lime-500/20 border border-emerald-500/20`}>
                    <TrendingUp className="w-6 h-6 text-emerald-400 mb-2" /><div className={`text-3xl font-bold ${text}`}>{stats.totalPurchases}</div><div className={`text-sm ${textMuted}`}>Completados</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20`}>
                    <Calendar className="w-6 h-6 text-emerald-400 mb-2" /><div className={`text-xl font-bold ${text}`}>{stats.mostActiveDay}</div><div className={`text-sm ${textMuted}`}>Día más activo</div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl ${bgCard} border ${border}`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${text}`}><Package className="w-5 h-5 text-emerald-400" />Top elementos</h3>
                  <div className="space-y-3">
                    {stats.topProducts.length > 0 ? stats.topProducts.map(([name, count], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg ${bgInput} flex items-center justify-center text-sm font-medium ${text}`}>{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1"><span className={`font-medium ${text}`}>{name}</span><span className={textMuted}>{count}x</span></div>
                          <div className={`h-1.5 ${bgInput} rounded-full overflow-hidden`}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.topProducts[0][1]) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )) : <p className={`${textMuted} text-center py-4`}>Aún no hay datos</p>}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl ${bgCard} border ${border}`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${text}`}><PieChart className="w-5 h-5 text-emerald-400" />Categorías</h3>
                  <div className="space-y-3">
                    {stats.categoryStats.length > 0 ? stats.categoryStats.map(([category, count]) => (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1"><span className={`font-medium ${text}`}>{category}</span><span className={textMuted}>{count}</span></div>
                          <div className={`h-1.5 ${bgInput} rounded-full overflow-hidden`}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.categoryStats[0][1]) * 100}%` }} className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[category]} rounded-full`} />
                          </div>
                        </div>
                      </div>
                    )) : <p className={`${textMuted} text-center py-4`}>Aún no hay datos</p>}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl ${bgCard} border ${border}`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${text}`}><Calendar className="w-5 h-5 text-cyan-400" />Patrón semanal</h3>
                  <div className="flex justify-between items-end h-32">
                    {stats.dayNames.map((day, i) => {
                      const count = stats.dayOfWeekCounts[i] || 0
                      const maxCount = Math.max(...Object.values(stats.dayOfWeekCounts)) || 1
                      const height = (count / maxCount) * 100
                      return (
                        <div key={day} className="flex flex-col items-center gap-2 flex-1">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(height, 5)}%` }}
                            className={`w-8 rounded-t-lg ${i === new Date().getDay() ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' : `${bgInput}`}`} />
                          <span className={`text-xs ${textMuted}`}>{day}</span>
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
        <FavoritesView
          show={showFavorites}
          onClose={() => setShowFavorites(false)}
          favorites={favorites}
          onAdd={addFromFavorite}
          searchTerm={favoriteSearchTerm}
          setSearchTerm={setFavoriteSearchTerm}
          theme={themeProps}
        />
        <AIGenerateModal
          show={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGenerate={generateWithAI}
          theme={themeProps}
        />
        {editingItem && <EditModal item={editingItem} onSave={updateItem} onClose={() => setEditingItem(null)} theme={themeProps} />}
      </AnimatePresence>
    </div>
  )
}

export default App
