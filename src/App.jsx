import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, Plus, Trash2, Check, Share2, BarChart3, 
  LogOut, Copy, Users, Package, Clock, TrendingUp,
  Sparkles, X, ChevronDown, Search, Filter, Calendar,
  PieChart, ArrowRight, Loader2, CheckCircle2, Circle,
  ListChecks, Home
} from 'lucide-react'
import confetti from 'canvas-confetti'

// Supabase client - SE CONFIGURARÁ CON TUS CREDENCIALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Categorías automáticas basadas en productos comunes
const CATEGORY_KEYWORDS = {
  'Frutas y Verduras': ['manzana', 'plátano', 'naranja', 'tomate', 'lechuga', 'cebolla', 'ajo', 'patata', 'zanahoria', 'pimiento', 'pepino', 'limón', 'fresa', 'uva', 'sandía', 'melón', 'pera', 'kiwi', 'aguacate', 'espinaca', 'brócoli', 'coliflor', 'calabacín', 'berenjena', 'champiñón', 'seta', 'fruta', 'verdura', 'vegetal', 'ensalada', 'mandarina', 'pomelo', 'cereza', 'melocotón', 'ciruela', 'mango', 'piña', 'coco', 'granada', 'higo', 'frambuesa', 'mora', 'arándano', 'remolacha', 'nabo', 'puerro', 'apio', 'acelga', 'col', 'repollo', 'alcachofa', 'espárrago', 'judía verde', 'guisante', 'maíz', 'rábano', 'jengibre', 'perejil', 'cilantro', 'albahaca', 'menta', 'romero', 'orégano', 'tomillo'],
  'Carnes': ['pollo', 'ternera', 'cerdo', 'cordero', 'pavo', 'jamón', 'chorizo', 'salchicha', 'bacon', 'carne', 'filete', 'lomo', 'costilla', 'chuleta', 'hamburguesa', 'albóndiga', 'salchichón', 'mortadela', 'morcilla', 'butifarra', 'longaniza', 'chistorra', 'sobrasada', 'paté', 'foie', 'pechuga', 'muslo', 'alita', 'conejo', 'codorniz', 'pato', 'bistec', 'entrecot', 'solomillo', 'secreto', 'pluma', 'carrillera', 'rabo', 'lengua', 'hígado', 'mollejas', 'callos'],
  'Pescados y Mariscos': ['pescado', 'salmón', 'atún', 'merluza', 'bacalao', 'sardina', 'boquerón', 'anchoa', 'trucha', 'lubina', 'dorada', 'rape', 'lenguado', 'gallo', 'rodaballo', 'cabracho', 'besugo', 'pez espada', 'gambas', 'langostino', 'camarón', 'cigala', 'bogavante', 'langosta', 'cangrejo', 'mejillón', 'almeja', 'berberecho', 'navaja', 'ostra', 'vieira', 'pulpo', 'calamar', 'sepia', 'chipirón', 'marisco', 'surimi', 'palitos de cangrejo', 'caviar', 'huevas'],
  'Lácteos': ['leche', 'yogur', 'queso', 'mantequilla', 'nata', 'crema', 'cuajada', 'requesón', 'kéfir', 'batido', 'flan', 'natillas', 'arroz con leche', 'helado', 'mozzarella', 'parmesano', 'cheddar', 'gouda', 'emmental', 'brie', 'camembert', 'roquefort', 'manchego', 'tetilla', 'cabrales', 'idiazábal', 'queso fresco', 'queso crema', 'mascarpone', 'ricotta', 'burrata', 'leche entera', 'leche desnatada', 'leche semidesnatada', 'leche sin lactosa', 'leche de avena', 'leche de soja', 'leche de almendra', 'leche de coco', 'yogur griego', 'yogur natural', 'petit suisse'],
  'Panadería': ['pan', 'baguette', 'chapata', 'mollete', 'hogaza', 'pan de molde', 'pan integral', 'pan de centeno', 'croissant', 'napolitana', 'palmera', 'donut', 'magdalena', 'bizcocho', 'tostada', 'panecillo', 'bollo', 'ensaimada', 'torrija', 'churro', 'porra', 'rosquilla', 'muffin', 'brownie', 'cookie', 'galleta', 'barquillo', 'gofre', 'crepe', 'tortita', 'empanada', 'empanadilla', 'hojaldre', 'pasta de hojaldre', 'masa', 'levadura', 'harina para pan'],
  'Bebidas': ['agua', 'zumo', 'refresco', 'coca-cola', 'fanta', 'sprite', 'cerveza', 'vino', 'café', 'té', 'infusión', 'batido', 'smoothie', 'leche', 'horchata', 'cava', 'champán', 'sidra', 'vermut', 'sangría', 'tinto de verano', 'ginebra', 'vodka', 'ron', 'whisky', 'brandy', 'licor', 'aquarius', 'gatorade', 'monster', 'red bull', 'tónica', 'soda', 'bitter', 'limonada', 'naranjada', 'granizado', 'mosto', 'néctar', 'cola', 'light', 'zero', 'sin azúcar', 'isotónica'],
  'Despensa': ['arroz', 'pasta', 'espagueti', 'macarrón', 'fideos', 'tallarín', 'lasaña', 'canelón', 'ravioli', 'tortellini', 'ñoqui', 'cuscús', 'quinoa', 'bulgur', 'polenta', 'harina', 'azúcar', 'sal', 'aceite', 'vinagre', 'especias', 'pimienta', 'pimentón', 'canela', 'nuez moscada', 'curry', 'cúrcuma', 'comino', 'tomillo', 'laurel', 'legumbre', 'lenteja', 'garbanzo', 'judía', 'alubia', 'habichuela', 'conserva', 'lata', 'atún en lata', 'sardina en lata', 'tomate frito', 'tomate triturado', 'salsa', 'mayonesa', 'ketchup', 'mostaza', 'soja', 'miel', 'mermelada', 'chocolate', 'cacao', 'café molido', 'café soluble', 'té', 'galletas', 'cereales', 'muesli', 'avena', 'frutos secos', 'almendra', 'nuez', 'cacahuete', 'pistacho', 'anacardo', 'avellana', 'pipas', 'olivas', 'aceitunas', 'pepinillo', 'cebolleta', 'alcaparra'],
  'Congelados': ['congelado', 'helado', 'pizza congelada', 'croqueta', 'nugget', 'palito de pescado', 'patatas congeladas', 'verduras congeladas', 'guisantes congelados', 'judías congeladas', 'espinacas congeladas', 'pescado congelado', 'marisco congelado', 'pollo congelado', 'hamburguesa congelada', 'lasaña congelada', 'canelones congelados', 'san jacobo', 'empanada congelada', 'masa congelada', 'hielo', 'cubitos', 'sorbete', 'polo', 'magnum', 'cornetto', 'tarrina', 'tarta helada'],
  'Limpieza': ['jabón', 'detergente', 'lejía', 'suavizante', 'lavavajillas', 'limpiador', 'fregasuelos', 'desinfectante', 'amoniaco', 'quitagrasas', 'quitamanchas', 'antical', 'limpiacristales', 'multiusos', 'estropajo', 'bayeta', 'fregona', 'escoba', 'recogedor', 'cubo', 'guantes', 'bolsas de basura', 'papel de aluminio', 'film', 'papel de horno', 'servilleta', 'papel de cocina', 'rollo de cocina', 'ambientador', 'insecticida', 'raticida'],
  'Higiene Personal': ['champú', 'gel', 'jabón', 'desodorante', 'pasta de dientes', 'cepillo de dientes', 'hilo dental', 'enjuague bucal', 'crema', 'loción', 'after shave', 'maquinilla', 'cuchilla', 'espuma de afeitar', 'colonia', 'perfume', 'pañuelo', 'papel higiénico', 'toallita', 'compresa', 'tampón', 'pañal', 'bastoncillo', 'algodón', 'tirita', 'esparadrapo', 'gasa', 'alcohol', 'agua oxigenada', 'betadine', 'termómetro', 'mascarilla', 'test'],
  'Snacks y Dulces': ['patatas fritas', 'chips', 'nachos', 'palomitas', 'snack', 'aperitivo', 'frutos secos', 'chocolate', 'bombón', 'caramelo', 'chicle', 'regaliz', 'gominola', 'chuchería', 'galleta', 'barrita', 'bollería', 'pastel', 'tarta', 'donut', 'palmera', 'croissant', 'napolitana', 'ensaimada', 'sobaos', 'magdalena', 'bizcocho', 'brownie', 'muffin', 'cookie', 'oreo', 'kitkat', 'twix', 'mars', 'snickers', 'kinder', 'nutella', 'nocilla', 'helado', 'polo', 'piruleta'],
  'Mascotas': ['comida perro', 'comida gato', 'pienso', 'lata mascota', 'snack mascota', 'premio', 'arena gato', 'hueso', 'juguete mascota', 'collar', 'correa', 'champú mascota', 'antiparasitario', 'pipeta', 'comedero', 'bebedero', 'cama mascota', 'transportín', 'rascador'],
  'Otros': []
}

// Función para detectar categoría automáticamente
const detectCategory = (productName) => {
  const nameLower = productName.toLowerCase().trim()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Otros') continue
    for (const keyword of keywords) {
      if (nameLower.includes(keyword) || keyword.includes(nameLower)) {
        return category
      }
    }
  }
  return 'Otros'
}

// Iconos por categoría
const CATEGORY_ICONS = {
  'Frutas y Verduras': '🥬',
  'Carnes': '🥩',
  'Pescados y Mariscos': '🐟',
  'Lácteos': '🧀',
  'Panadería': '🥖',
  'Bebidas': '🥤',
  'Despensa': '🫙',
  'Congelados': '🧊',
  'Limpieza': '🧹',
  'Higiene Personal': '🧴',
  'Snacks y Dulces': '🍫',
  'Mascotas': '🐾',
  'Otros': '📦'
}

// Colores por categoría
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

// Componente principal
function App() {
  const [view, setView] = useState('home') // home, list, stats
  const [lists, setLists] = useState([])
  const [currentList, setCurrentList] = useState(null)
  const [items, setItems] = useState([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [accessCode, setAccessCode] = useState('')
  const [newListName, setNewListName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showCompleted, setShowCompleted] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeUsers, setActiveUsers] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Crear nueva lista
  const createList = async () => {
    if (!newListName.trim()) {
      showNotification('Introduce un nombre para la lista', 'error')
      return
    }
    
    setIsLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([{ name: newListName, access_code: code }])
      .select()
      .single()
    
    if (error) {
      showNotification('Error al crear la lista', 'error')
      setIsLoading(false)
      return
    }
    
    setCurrentList(data)
    setAccessCode(code)
    setNewListName('')
    setView('list')
    setIsLoading(false)
    showNotification('¡Lista creada! Comparte el código con tu pareja')
    
    // Confetti al crear lista
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  // Unirse a lista existente
  const joinList = async () => {
    if (!accessCode.trim()) {
      showNotification('Introduce un código de acceso', 'error')
      return
    }
    
    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('access_code', accessCode.toUpperCase())
      .single()
    
    if (error || !data) {
      showNotification('Código no encontrado', 'error')
      setIsLoading(false)
      return
    }
    
    setCurrentList(data)
    setView('list')
    setIsLoading(false)
    showNotification('¡Te has unido a la lista!')
  }

  // Cargar items de la lista con suscripción en tiempo real
  useEffect(() => {
    if (!currentList) return
    
    const fetchItems = async () => {
      const { data } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('list_id', currentList.id)
        .order('created_at', { ascending: false })
      
      if (data) setItems(data)
    }
    
    fetchItems()
    
    // Suscripción en tiempo real
    const channel = supabase
      .channel(`list-${currentList.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'shopping_items',
          filter: `list_id=eq.${currentList.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new : item
            ))
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setActiveUsers(Object.keys(state).length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: Date.now() })
        }
      })
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentList])

  // Añadir item
  const addItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    
    const category = detectCategory(newItemName)
    
    const { error } = await supabase
      .from('shopping_items')
      .insert([{
        list_id: currentList.id,
        name: newItemName.trim(),
        quantity: newItemQuantity,
        category,
        completed: false
      }])
    
    if (error) {
      showNotification('Error al añadir el producto', 'error')
      return
    }
    
    // Registrar en historial para estadísticas
    await supabase
      .from('purchase_history')
      .insert([{
        list_id: currentList.id,
        item_name: newItemName.trim(),
        category,
        action: 'added'
      }])
    
    setNewItemName('')
    setNewItemQuantity(1)
  }

  // Marcar como comprado
  const toggleComplete = async (item) => {
    const { error } = await supabase
      .from('shopping_items')
      .update({ 
        completed: !item.completed,
        completed_at: !item.completed ? new Date().toISOString() : null
      })
      .eq('id', item.id)
    
    if (!error && !item.completed) {
      // Registrar compra para estadísticas
      await supabase
        .from('purchase_history')
        .insert([{
          list_id: currentList.id,
          item_name: item.name,
          category: item.category,
          action: 'purchased'
        }])
      
      // Mini confetti al completar
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      })
    }
  }

  // Eliminar item
  const deleteItem = async (id) => {
    await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id)
  }

  // Cargar estadísticas
  const loadStats = async () => {
    if (!currentList) return
    
    setIsLoading(true)
    
    const { data: history } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('list_id', currentList.id)
      .eq('action', 'purchased')
    
    if (history) {
      // Productos más comprados
      const productCounts = {}
      const categoryCounts = {}
      const dayOfWeekCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      const hourCounts = {}
      
      history.forEach(item => {
        // Contar productos
        productCounts[item.item_name] = (productCounts[item.item_name] || 0) + 1
        
        // Contar categorías
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
        
        // Contar por día de la semana
        const date = new Date(item.created_at)
        dayOfWeekCounts[date.getDay()]++
        
        // Contar por hora
        const hour = date.getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })
      
      // Top 10 productos
      const topProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
      
      // Categorías ordenadas
      const categoryStats = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
      
      // Día más activo
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const mostActiveDay = Object.entries(dayOfWeekCounts)
        .sort((a, b) => b[1] - a[1])[0]
      
      // Hora más activa
      const mostActiveHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0]
      
      setStats({
        totalPurchases: history.length,
        topProducts,
        categoryStats,
        mostActiveDay: dayNames[parseInt(mostActiveDay?.[0] || 0)],
        mostActiveHour: mostActiveHour ? `${mostActiveHour[0]}:00` : 'N/A',
        dayOfWeekCounts,
        dayNames
      })
    }
    
    setIsLoading(false)
    setView('stats')
  }

  // Copiar código al portapapeles
  const copyCode = () => {
    navigator.clipboard.writeText(currentList?.access_code || accessCode)
    setCopiedCode(true)
    showNotification('¡Código copiado!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Limpiar completados
  const clearCompleted = async () => {
    const completedItems = items.filter(item => item.completed)
    
    for (const item of completedItems) {
      await supabase
        .from('shopping_items')
        .delete()
        .eq('id', item.id)
    }
    
    showNotification(`${completedItems.length} productos eliminados`)
  }

  // Filtrar items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesCompleted = showCompleted || !item.completed
    return matchesSearch && matchesCategory && matchesCompleted
  })

  // Agrupar por categoría
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  // Categorías activas
  const activeCategories = [...new Set(items.map(item => item.category))]

  // Contadores
  const totalItems = items.length
  const completedItems = items.filter(i => i.completed).length
  const pendingItems = totalItems - completedItems
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Notificación */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              notification.type === 'error' 
                ? 'bg-red-500/20 border-red-500/30 text-red-200'
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HOME VIEW */}
      {view === 'home' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen flex flex-col items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 mb-6 shadow-2xl shadow-violet-500/30">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                ListaCompra
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-md mx-auto">
              Listas compartidas en tiempo real con tu pareja
            </p>
          </motion.div>

          <div className="w-full max-w-md space-y-6">
            {/* Crear nueva lista */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Crear nueva lista
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre de la lista (ej: Compra semanal)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createList()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createList}
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Crear lista
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Separador */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-white/30 text-sm">o</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Unirse a lista */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                Unirse a lista existente
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Código de acceso (6 caracteres)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && joinList()}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 uppercase tracking-widest text-center text-xl font-mono"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={joinList}
                  disabled={isLoading || accessCode.length !== 6}
                  className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Unirse
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-4 text-center text-sm text-white/40 max-w-md w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <span>Compartida</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Tiempo real</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <span>Estadísticas</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && currentList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen"
        >
          {/* Header */}
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setView('home')
                      setCurrentList(null)
                      setItems([])
                    }}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                  </motion.button>
                  <div>
                    <h1 className="text-xl font-bold">{currentList.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      {activeUsers > 1 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          {activeUsers} online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors"
                  >
                    {copiedCode ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="font-mono tracking-wider">{currentList.access_code}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadStats}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">{pendingItems} pendientes</span>
                  <span className="text-emerald-400">{completedItems} completados</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Add item form */}
              <form onSubmit={addItem} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Añadir producto..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNewItemQuantity(Math.max(1, newItemQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm">{newItemQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setNewItemQuantity(newItemQuantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </form>

              {/* Filters */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                    filterCategory === 'all' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  Todos
                </button>
                {activeCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-1 ${
                      filterCategory === cat 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Items list */}
          <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
            {Object.keys(groupedItems).length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lista vacía</h3>
                <p className="text-white/50">Añade tu primer producto arriba</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                      <h2 className="text-lg font-semibold">{category}</h2>
                      <span className="text-white/30 text-sm">({categoryItems.length})</span>
                    </div>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {categoryItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                              item.completed
                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleComplete(item)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                item.completed
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white/10 hover:bg-white/20'
                              }`}
                            >
                              {item.completed ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5 text-white/30" />
                              )}
                            </motion.button>
                            <div className="flex-1">
                              <span className={`font-medium ${item.completed ? 'line-through text-white/50' : ''}`}>
                                {item.name}
                              </span>
                              {item.quantity > 1 && (
                                <span className="ml-2 text-sm text-white/50">x{item.quantity}</span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteItem(item.id)}
                              className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>

          {/* Bottom actions */}
          {completedItems > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] to-transparent"
            >
              <div className="max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearCompleted}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <ListChecks className="w-5 h-5" />
                  Limpiar {completedItems} completados
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* STATS VIEW */}
      {view === 'stats' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen"
        >
          {/* Header */}
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView('list')}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold">Estadísticas</h1>
                  <p className="text-sm text-white/50">Patrones de compra</p>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              </div>
            ) : stats ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20"
                  >
                    <TrendingUp className="w-6 h-6 text-violet-400 mb-2" />
                    <div className="text-3xl font-bold">{stats.totalPurchases}</div>
                    <div className="text-sm text-white/50">Compras totales</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20"
                  >
                    <Calendar className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-xl font-bold">{stats.mostActiveDay}</div>
                    <div className="text-sm text-white/50">Día más activo</div>
                  </motion.div>
                </div>

                {/* Top products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-violet-400" />
                    Top 10 productos más comprados
                  </h3>
                  <div className="space-y-3">
                    {stats.topProducts.map(([name, count], index) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{name}</span>
                            <span className="text-white/50">{count}x</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / stats.topProducts[0][1]) * 100}%` }}
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                              transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {stats.topProducts.length === 0 && (
                      <p className="text-white/50 text-center py-4">Aún no hay datos suficientes</p>
                    )}
                  </div>
                </motion.div>

                {/* Categories breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-400" />
                    Categorías más compradas
                  </h3>
                  <div className="space-y-3">
                    {stats.categoryStats.map(([category, count]) => (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{category}</span>
                            <span className="text-white/50">{count} productos</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / stats.categoryStats[0][1]) * 100}%` }}
                              className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[category]} rounded-full`}
                              transition={{ delay: 0.4, duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {stats.categoryStats.length === 0 && (
                      <p className="text-white/50 text-center py-4">Aún no hay datos suficientes</p>
                    )}
                  </div>
                </motion.div>

                {/* Weekly pattern */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Patrón semanal
                  </h3>
                  <div className="flex justify-between items-end h-32">
                    {stats.dayNames.map((day, index) => {
                      const count = stats.dayOfWeekCounts[index] || 0
                      const maxCount = Math.max(...Object.values(stats.dayOfWeekCounts)) || 1
                      const height = (count / maxCount) * 100
                      return (
                        <div key={day} className="flex flex-col items-center gap-2 flex-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 5)}%` }}
                            className={`w-8 rounded-t-lg ${
                              index === new Date().getDay()
                                ? 'bg-gradient-to-t from-cyan-500 to-cyan-400'
                                : 'bg-white/20'
                            }`}
                            transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                          />
                          <span className="text-xs text-white/50">{day.slice(0, 3)}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/50">No se pudieron cargar las estadísticas</p>
              </div>
            )}
          </main>
        </motion.div>
      )}
    </div>
  )
}

export default App
