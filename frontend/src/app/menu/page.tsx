'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCarrito } from '@/contexts/CarritoContext'
import { getItemMenusByVendedor } from '@/services/itemMenuService'
import { addItemToCarrito } from '@/services/carritoService'
import CarritoDropdown from '@/components/CarritoDropdown'
import type { ItemMenuDTO, CategoriaDTO } from '@/types/itemMenu'
import axios from 'axios'

export default function MenuPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const { refreshCarrito } = useCarrito()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [itemMenus, setItemMenus] = useState<ItemMenuDTO[]>([])
  const [loadingMenu, setLoadingMenu] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Estados por ítem individual
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({})
  const [qtyById, setQtyById] = useState<Record<number, number>>({})
  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({})
  const [errorById, setErrorById] = useState<Record<number, string | null>>({})
  const [successById, setSuccessById] = useState<Record<number, string | null>>({})
  
  // Estados para filtrado por categorías
  const [availableCategories, setAvailableCategories] = useState<CategoriaDTO[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set())
  const [filteredItems, setFilteredItems] = useState<ItemMenuDTO[]>([])

  const vendedorId = searchParams.get('vendedorId')
  const vendedorNombre = searchParams.get('vendedorNombre')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && vendedorId) {
      setLoadingMenu(true)
      setError(null)
      setItemMenus([])
      
      getItemMenusByVendedor(parseInt(vendedorId))
        .then(data => {
          console.log('Items recibidos del backend:', data)
          console.log('Primer item:', data[0])
          setItemMenus(data)
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.resultado?.mensaje ||
              'No se pudo cargar el menú del vendedor.'
            )
          } else {
            setError('Error inesperado al cargar el menú.')
          }
        })
        .finally(() => setLoadingMenu(false))
    }
  }, [isAuthenticated, vendedorId])

  // Extraer categorías únicas cuando cambian los items del menú
  useEffect(() => {
    console.log('🔍 DEBUG: Ejecutando useEffect para extraer categorías')
    console.log('🔍 DEBUG: itemMenus:', itemMenus)
    console.log('🔍 DEBUG: itemMenus.length:', itemMenus.length)
    
    const categorias = new Map<number, CategoriaDTO>()
    
    itemMenus.forEach((item, index) => {
      console.log(`🔍 DEBUG: Item ${index}:`, item)
      console.log(`🔍 DEBUG: Item ${index} categorias:`, item.categorias)
      console.log(`🔍 DEBUG: Item ${index} categorias tipo:`, typeof item.categorias)
      console.log(`🔍 DEBUG: Item ${index} categorias es array:`, Array.isArray(item.categorias))
      
      if (item.categorias && Array.isArray(item.categorias)) {
        item.categorias.forEach(categoria => {
          console.log(`🔍 DEBUG: Procesando categoria:`, categoria)
          if (!categorias.has(categoria.id)) {
            categorias.set(categoria.id, categoria)
          }
        })
      }
    })
    
    const categoriasArray = Array.from(categorias.values())
    console.log('🔍 DEBUG: Categorías extraídas:', categoriasArray)
    setAvailableCategories(categoriasArray)
  }, [itemMenus])

  // Filtrar items basado en las categorías seleccionadas
  useEffect(() => {
    if (selectedCategoryIds.size === 0) {
      // Si no hay categorías seleccionadas, mostrar todos los items
      setFilteredItems(itemMenus)
    } else {
      // Filtrar items que tengan al menos una de las categorías seleccionadas
      const filtered = itemMenus.filter(item => {
        if (!item.categorias || !Array.isArray(item.categorias)) {
          return false
        }
        return item.categorias.some(categoria => selectedCategoryIds.has(categoria.id))
      })
      setFilteredItems(filtered)
    }
  }, [itemMenus, selectedCategoryIds])

  // Cargar carrito cuando se autentica el usuario
  useEffect(() => {
    if (isAuthenticated) {
      refreshCarrito()
    }
  }, [isAuthenticated, refreshCarrito])

  // Redirect if no vendedor ID
  useEffect(() => {
    if (!vendedorId) {
      router.push('/vendedores')
    }
  }, [vendedorId, router])

  const handleSelectItem = (itemId: number) => {
    console.log('Intentando seleccionar item con ID:', itemId, 'tipo:', typeof itemId)
    
    setSelectedItems(prev => {
      console.log('Estado previo:', prev)
      const newState = { 
        ...prev, 
        [itemId]: !prev[itemId] 
      }
      console.log('Nuevo estado:', newState)
      return newState
    })
    
    // Inicializar cantidad si no existe
    if (!qtyById[itemId]) {
      setQtyById(prev => ({ ...prev, [itemId]: 1 }))
    }
  }

  const handleCategoryFilter = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const clearCategoryFilters = () => {
    setSelectedCategoryIds(new Set())
  }

  const handleAgregarAlCarrito = async (item: ItemMenuDTO) => {
    if (!user || !selectedItems[item.itemMenuId]) {
      setErrorById(prev => ({ ...prev, [item.itemMenuId]: "Primero selecciona este item" }))
      setTimeout(() => {
        setErrorById(prev => ({ ...prev, [item.itemMenuId]: null }))
      }, 3000)
      return
    }
    
    // Limpiar errores previos para este ítem
    setErrorById(prev => ({ ...prev, [item.itemMenuId]: null }))
    // Marcar este ítem específico como "cargando"
    setLoadingById(prev => ({ ...prev, [item.itemMenuId]: true }))
    
    try {
      const cantidad = qtyById[item.itemMenuId] ?? 1
      // Llamar al backend para agregar el ítem
      const response = await addItemToCarrito(
        item.itemMenuId, 
        cantidad, 
        user.idCliente, 
        item.vendedorid
        //parseInt(vendedorId!)
      )
      
      // Mostrar mensaje de éxito solo para este ítem}
      if(response.resultado.status === 0){
              setSuccessById(prev => ({ 
        ...prev, 
        [item.itemMenuId]: "¡Producto agregado al carrito!" 
      }))
      
      // Actualizar el carrito después de agregar el item
      refreshCarrito()
      }else{
        setErrorById(prev => ({ ...prev, [item.itemMenuId]: response.resultado.mensaje || "No se pudo agregar al carrito" }))
        setTimeout(() => {
          setErrorById(prev => ({ ...prev, [item.itemMenuId]: null }))
        }, 5000)

      }

      
      // Deseleccionar el item después de agregarlo
      setSelectedItems(prev => ({ ...prev, [item.itemMenuId]: false }))
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccessById(prev => ({ ...prev, [item.itemMenuId]: null }))
      }, 3000)
      
    } catch (err) {
      // Manejar errores solo para este ítem
      let errorMsg = "No se pudo agregar al carrito"
      
      if (err instanceof Error) {
        errorMsg = err.message
      }
      
      setErrorById(prev => ({ ...prev, [item.itemMenuId]: errorMsg }))
      
      // Limpiar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setErrorById(prev => ({ ...prev, [item.itemMenuId]: null }))
      }, 5000)
    } finally {
      // Desmarcar este ítem específico como "cargando"
      setLoadingById(prev => ({ ...prev, [item.itemMenuId]: false }))
    }
  }

  const handleCantidadChange = (itemId: number, nuevaCantidad: number) => {
    setQtyById(prev => ({ 
      ...prev, 
      [itemId]: Math.max(1, nuevaCantidad) 
    }))
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/vendedores')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Vendedores
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Menú de {vendedorNombre || 'Vendedor'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CarritoDropdown />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bienvenido, {user?.nombre}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendedorNombre || 'Menú del Vendedor'}
                </h2>
                <p className="text-gray-600">Descubre los deliciosos platos disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros por Categorías */}
        {availableCategories.length > 0 && (
          <div className="mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filtrar por Categorías</h3>
                {selectedCategoryIds.size > 0 && (
                  <button
                    onClick={clearCategoryFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => handleCategoryFilter(categoria.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategoryIds.has(categoria.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
              
              {selectedCategoryIds.size > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  Mostrando {filteredItems.length} de {itemMenus.length} productos
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingMenu ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando menú...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 && itemMenus.length === 0 ? (
          /* Empty State */
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay elementos en el menú
              </h3>
              <p className="text-gray-500 mb-6">
                Este vendedor aún no tiene platos disponibles.
              </p>
              <button
                onClick={() => router.push('/vendedores')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Ver Otros Vendedores
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 && selectedCategoryIds.size > 0 ? (
          /* No results for current filters */
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-6">
                No hay productos que coincidan con las categorías seleccionadas.
              </p>
              <button
                onClick={clearCategoryFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        ) : (
          /* Menu Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              // Verificación más estricta del ID
              const itemId = item.itemMenuId
              
              if (!itemId || typeof itemId !== 'number') {
                console.error('Item con ID inválido encontrado:', { item, idx })
                return null
              }
              
              return (
                <div
                  key={itemId} // Usar el ID validado
                  className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    selectedItems[itemId] ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                  }`}
                  onClick={() => handleSelectItem(itemId)}
                >
                <div className="p-6">
                  {/* Indicador de selección */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems[itemId] || false}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectItem(itemId)
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {selectedItems[itemId] ? 'Seleccionado' : 'Seleccionar'}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.stock > 0 ? `Stock: ${item.stock}` : 'Sin stock'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.nombre}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.descripcion || 'Sin descripción'}</p>
                      
                      {/* Mostrar categorías del item */}
                      {item.categorias && item.categorias.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.categorias.map((categoria) => (
                            <span
                              key={categoria.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {categoria.nombre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-semibold text-gray-900">${item.precio}</p>
                      <p className="text-xs text-gray-500">{item.esBebida ? 'Bebida' : 'Plato'}</p>
                    </div>
                  </div>

                  {/* Mensajes de éxito o error para este ítem específico */}
                  {successById[itemId] && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
                      {successById[itemId]}
                    </div>
                  )}
                  
                  {errorById[itemId] && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                      {errorById[itemId]}
                    </div>
                  )}

                  {/* Selector de cantidad solo si está seleccionado */}
                  {selectedItems[itemId] && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">Cantidad:</label>
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-l-md"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newCantidad = Math.max(1, (qtyById[itemId] || 1) - 1)
                              handleCantidadChange(itemId, newCantidad)
                            }}
                            disabled={loadingById[itemId]}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={qtyById[itemId] || 1}
                            onChange={(e) => {
                              e.stopPropagation()
                              const value = parseInt(e.target.value)
                              if (!isNaN(value)) {
                                handleCantidadChange(itemId, value)
                              }
                            }}
                            className="w-12 text-center border-none focus:outline-none focus:ring-0"
                            disabled={loadingById[itemId]}
                          />
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-md"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newCantidad = Math.min(item.stock, (qtyById[itemId] || 1) + 1)
                              handleCantidadChange(itemId, newCantidad)
                            }}
                            disabled={loadingById[itemId] || (qtyById[itemId] || 1) >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botón de Agregar al Carrito */}
                  <div className="mt-4">
                    <button
                      className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.stock > 0 && selectedItems[itemId] && !loadingById[itemId]
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={item.stock === 0 || !selectedItems[itemId] || loadingById[itemId]}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAgregarAlCarrito(item)
                      }}
                    >
                      {loadingById[itemId] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Agregando...
                        </>
                      ) : !selectedItems[itemId] ? (
                        'Primero selecciona este item'
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 4m1.8-4L10 17m4 0h6m-6 0a2 2 0 11-4 0m4 0a2 2 0 104 0" />
                          </svg>
                          Agregar al Carrito
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        )}

        {/* Stats Section */}
        {itemMenus.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedCategoryIds.size > 0
                  ? `${filteredItems.length} de ${itemMenus.length} platos mostrados`
                  : `${itemMenus.length} platos disponibles`
                }
              </h3>
              <p className="text-gray-500">
                {selectedCategoryIds.size > 0
                  ? `Filtrado por ${selectedCategoryIds.size} categoría${selectedCategoryIds.size > 1 ? 's' : ''}`
                  : 'Explora todo el menú y encuentra tu plato favorito'
                }
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
