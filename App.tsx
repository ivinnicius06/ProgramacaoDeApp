import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Os trajetos são de linhas reais. Os números do dashboard são fictícios.
const linhas = [
  { codigo: '401', origem: 'Brazlândia (Veredas)', destino: 'Brazlândia (circular)', trajeto: 'Via DF-240, Taguatinga Sul e Católica', onibus: 8, passageiros: 3100, tempo: 90, atrasos: 14, ocupacao: 74, arrecadacao: 18600 },
  { codigo: '402.7', origem: 'Brazlândia (Veredas)', destino: 'Brazlândia (circular)', trajeto: 'Via INCRA 7, Ceilândia (Via Leste), Taguatinga Sul e Católica', onibus: 4, passageiros: 1200, tempo: 100, atrasos: 12, ocupacao: 70, arrecadacao: 7200 },
  { codigo: '092', origem: 'Guará I/II', destino: 'Taguatinga Centro', trajeto: 'Via ParkShopping, Candangolândia, Núcleo Bandeirante e Pistão Sul/Norte', onibus: 12, passageiros: 4200, tempo: 85, atrasos: 18, ocupacao: 78, arrecadacao: 25200 },
  { codigo: '355.3', origem: 'Taguatinga Sul', destino: 'Taguatinga Sul (circular)', trajeto: 'Via Areal, Samdu, Comercial, Centro, QNG e Vicente Pires', onibus: 10, passageiros: 3500, tempo: 75, atrasos: 15, ocupacao: 72, arrecadacao: 21000 },
  { codigo: '355.2', origem: 'Taguatinga Sul', destino: 'Taguatinga Sul (circular)', trajeto: 'Via Vicente Pires, Areal (QS 11), Samdu, Comercial e QNG', onibus: 9, passageiros: 2800, tempo: 70, atrasos: 10, ocupacao: 68, arrecadacao: 16800 },
  { codigo: '886', origem: 'Riacho Fundo I', destino: 'Setor O (Ceilândia)', trajeto: 'Via Taguatinga Norte e Via Leste', onibus: 15, passageiros: 5100, tempo: 66, atrasos: 24, ocupacao: 85, arrecadacao: 30600 },
];

type Linha = typeof linhas[number];
type TelasLinhas = { Lista: undefined; Detalhes: { linha: Linha } };
const Abas = createBottomTabNavigator();
const Pilha = createNativeStackNavigator<TelasLinhas>();

function Cartao({ children }: { children: React.ReactNode }) {
  return <View style={styles.cartao}>{children}</View>;
}

function Dashboard() {
  const passageiros = linhas.reduce((soma, linha) => soma + linha.passageiros, 0);
  const onibus = linhas.reduce((soma, linha) => soma + linha.onibus, 0);
  const maisPassageiros = [...linhas].sort((a, b) => b.passageiros - a.passageiros).slice(0, 3);
  const maisAtrasos = [...linhas].sort((a, b) => b.atrasos - a.atrasos).slice(0, 3);

  return <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
    <Text style={styles.titulo}>Painel do transporte por ônibus do DF</Text>
    <Text style={styles.aviso}>Trajetos reais. Indicadores fictícios para a atividade.</Text>
    <Cartao>
      <Text style={styles.subtitulo}>Indicadores gerais</Text>
      <Text>Linhas: {linhas.length}</Text>
      <Text>Ônibus: {onibus}</Text>
      <Text>Passageiros: {passageiros}</Text>
    </Cartao>
    <Cartao>
      <Text style={styles.subtitulo}>Linhas com mais passageiros</Text>
      {maisPassageiros.map(linha => <Text key={linha.codigo}>Linha {linha.codigo}: {linha.passageiros}</Text>)}
    </Cartao>
    <Cartao>
      <Text style={styles.subtitulo}>Linhas com mais atrasos</Text>
      {maisAtrasos.map(linha => <Text key={linha.codigo}>Linha {linha.codigo}: {linha.atrasos}%</Text>)}
    </Cartao>
  </ScrollView>;
}

function ListaLinhas({ navigation }: any) {
  return <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
    <Text style={styles.titulo}>Linhas de ônibus</Text>
    <Text style={styles.aviso}>Trajetos reais. Indicadores fictícios para a atividade.</Text>
    {linhas.map(linha => <TouchableOpacity key={linha.codigo} onPress={() => navigation.navigate('Detalhes', { linha })}>
      <Cartao>
        <Text style={styles.subtitulo}>Linha {linha.codigo}</Text>
        <Text>{linha.origem} → {linha.destino}</Text>
        <Text>{linha.trajeto}</Text>
        <Text>Ônibus: {linha.onibus}</Text>
        <Text>Passageiros: {linha.passageiros}</Text>
        <Text>Tempo médio: {linha.tempo} min</Text>
        <Text style={styles.link}>Ver detalhes →</Text>
      </Cartao>
    </TouchableOpacity>)}
  </ScrollView>;
}

function DetalhesLinha({ route }: any) {
  const { linha } = route.params as { linha: Linha };
  return <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
    <Text style={styles.titulo}>Linha {linha.codigo}</Text>
    <Text style={styles.aviso}>Indicadores fictícios para a atividade.</Text>
    <Cartao>
      <Text>Origem: {linha.origem}</Text>
      <Text>Destino: {linha.destino}</Text>
      <Text>Trajeto: {linha.trajeto}</Text>
      <Text>Quantidade de ônibus: {linha.onibus}</Text>
      <Text>Passageiros: {linha.passageiros}</Text>
      <Text>Tempo médio das viagens: {linha.tempo} min</Text>
      <Text>Percentual de atrasos: {linha.atrasos}%</Text>
      <Text>Ocupação média: {linha.ocupacao}%</Text>
      <Text>Arrecadação: R$ {linha.arrecadacao.toLocaleString('pt-BR')}</Text>
    </Cartao>
  </ScrollView>;
}

function NavegacaoLinhas() {
  return <Pilha.Navigator>
    <Pilha.Screen name="Lista" component={ListaLinhas} options={{ title: 'Linhas' }} />
    <Pilha.Screen name="Detalhes" component={DetalhesLinha} options={{ title: 'Detalhes da linha' }} />
  </Pilha.Navigator>;
}

function Barra({ nome, valor, maximo }: { nome: string; valor: number; maximo: number }) {
  return <View style={styles.itemGrafico}>
    <Text>{nome}: {valor}</Text>
    <View style={styles.trilho}><View style={[styles.barra, { width: `${valor / maximo * 100}%` }]} /></View>
  </View>;
}

function Analises() {
  const total = linhas.reduce((soma, linha) => soma + linha.arrecadacao, 0);
  const maior = [...linhas].sort((a, b) => b.arrecadacao - a.arrecadacao)[0];
  const maxPassageiros = Math.max(...linhas.map(linha => linha.passageiros));

  return <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
    <Text style={styles.titulo}>Análises</Text>
    <Text style={styles.aviso}>Valores fictícios para a atividade.</Text>
    <Cartao>
      <Text style={styles.subtitulo}>Arrecadação total</Text>
      <Text>R$ {total.toLocaleString('pt-BR')}</Text>
      <Text>Maior arrecadação: linha {maior.codigo}</Text>
    </Cartao>
    <Cartao>
      <Text style={styles.subtitulo}>Arrecadação por linha (R$)</Text>
      {linhas.map(linha => <Barra key={linha.codigo} nome={linha.codigo} valor={linha.arrecadacao} maximo={maior.arrecadacao} />)}
    </Cartao>
    <Cartao>
      <Text style={styles.subtitulo}>Passageiros por linha</Text>
      {linhas.map(linha => <Barra key={linha.codigo} nome={linha.codigo} valor={linha.passageiros} maximo={maxPassageiros} />)}
    </Cartao>
  </ScrollView>;
}

export default function App() {
  return <NavigationContainer>
    <Abas.Navigator screenOptions={{ tabBarActiveTintColor: '#1769aa' }}>
      <Abas.Screen name="Início" component={Dashboard} />
      <Abas.Screen name="Linhas" component={NavegacaoLinhas} options={{ headerShown: false }} />
      <Abas.Screen name="Análises" component={Analises} />
    </Abas.Navigator>
  </NavigationContainer>;
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f2f4f7' },
  conteudo: { padding: 16, paddingBottom: 30 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#123' },
  aviso: { color: '#555', marginBottom: 16 },
  cartao: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, gap: 6 },
  subtitulo: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  link: { color: '#1769aa', marginTop: 6 },
  itemGrafico: { marginTop: 10 },
  trilho: { height: 14, backgroundColor: '#e1e6ec', borderRadius: 7, marginTop: 4 },
  barra: { height: 14, backgroundColor: '#1769aa', borderRadius: 7 },
});
