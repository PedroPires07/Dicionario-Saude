import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../../services/firebase'
import Card from '../../components/Card'

export default function TermDetails({ route }){
  const { termId, term: termFromList } = route.params || {}
  const [term, setTerm] = React.useState(termFromList || null)
  const [isFav, setIsFav] = React.useState(false)

  
  React.useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        if(!term && termId){
          const snap = await getDoc(doc(db, 'termos', termId))
          if (mounted) setTerm(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        }
      }catch(e){}
    })()
    return ()=>{ mounted = false }
  },[termId])

 
  React.useEffect(()=>{
    ;(async ()=>{
      const uid = auth.currentUser?.uid
      if(!uid || !termId) return
      const favRef = doc(db, 'profiles', uid, 'favoritos', termId)
      const snap = await getDoc(favRef)
      setIsFav(snap.exists())
    })()
  },[termId])

  async function toggleFav(){
    const uid = auth.currentUser?.uid
    if(!uid || !term?.id) return
    const favRef = doc(db, 'profiles', uid, 'favoritos', term.id)
    if(isFav){
      await deleteDoc(favRef)
      setIsFav(false)
    }else{
      await setDoc(favRef, { createdAt: Date.now() })
      setIsFav(true)
    }
  }

  if(!term){
    return (
      <View style={{ flex:1, backgroundColor:'#F3F4F6', alignItems:'center', justifyContent:'center' }}>
        <Text>Carregando…</Text>
      </View>
    )
  }

  const titulo   = term.cientifico || '—'
  const subtit   = (term.populares || []).join(', ')
  const chips    = term.tags || term.areas || ['Medicina','Exames']  // adapte às suas chaves
  const descr    = term.descricao || term.descricão || term.description || 'Sem descrição.'
  const status   = term.status || 'Verificado'
  const revisado = term.revisadoEm || '01/01/2025'  // ajuste se tiver campo de data
  
  // Debug: verificar dados do Firestore
  console.log('Termo do Firestore:', term)

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#F3F4F6' }} contentContainerStyle={{ padding:16, paddingBottom:32 }}>
      <Card style={{ borderRadius:16 }}>
        {/* cabeçalho */}
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
          <View style={{ flex:1, paddingRight:12 }}>
            <Text style={{ fontSize:18, fontWeight:'800', color:'#111827' }}>{titulo}</Text>
            {!!subtit && <Text style={{ color:'#6B7280', marginTop:2 }}>{subtit}</Text>}
          </View>

          {/* estrela de favorito */}
          <Text onPress={toggleFav} style={{ fontSize:22 }}>{isFav ? '⭐' : '☆'}</Text>
        </View>

        {/* chips */}
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:12 }}>
          {chips.map((c)=>(
            <View key={c} style={{ backgroundColor:'#EEF2FF', borderRadius:16, paddingHorizontal:10, paddingVertical:4 }}>
              <Text style={{ color:'#4F46E5', fontWeight:'700' }}>{c}</Text>
            </View>
          ))}
        </View>

        {/* descrição */}
        <View style={{ marginTop:16 }}>
          <Text style={{ fontWeight:'800', marginBottom:6 }}>Descrição</Text>
          <Text style={{ lineHeight:20, color:'#111827' }}>{descr}</Text>
        </View>

        {/* selo verificado + revisado */}
        <View style={{ marginTop:16, borderTopWidth:1, borderTopColor:'#E5E7EB', paddingTop:12 }}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
            <View style={{ width:8, height:8, borderRadius:4, backgroundColor:'#10B981' }} />
            <Text style={{ color:'#065F46', fontWeight:'700' }}>{status === 'Verificado' ? 'Verificado' : status}</Text>
          </View>
          <Text style={{ color:'#6B7280', marginTop:4 }}>
            Revisado por Sistema em {revisado}
          </Text>
        </View>
      </Card>
    </ScrollView>
  )
}
