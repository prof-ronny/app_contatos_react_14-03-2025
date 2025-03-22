import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { getContatos, deleteContato, Contato } from "../services/contatos";
import { Link } from "expo-router";
import  styles  from "../estilos/main";

export default function HomeScreen() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarContatos = async () => {
    try {
      setLoading(true);
      const data = await getContatos();
      setContatos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os contatos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContato(id);
      setContatos(contatos.filter((c) => c._id !== id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o contato.");
    }
  };

  useEffect(() => {
    carregarContatos();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={contatos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.contato}>
            {item.foto !== "#" ? (
              <Image source={{ uri: item.foto }} style={styles.foto} />
            ) : (
              <View style={styles.semFoto}>
                <Text>Sem Foto</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text>{item.email}</Text>
              <Text>{item.telefone}</Text>
              <Text>{item.endereco}</Text>
              <Button title="Excluir" onPress={() => handleDelete(item._id)} />
              <Link href={{ pathname: "/editar/[id]",
                  params: { id: item._id } 
                 }} 
                 style={styles.botaoEditar}>
                  <Text style={
                    { color: "white",
                     marginTop: 5 }
                     }>Editar</Text>
              </Link>

            </View>
          </View>
        )}
      />
      <Link href="/novo" style={styles.botaoAdicionar}>
        <Text style={styles.textoBotao}>Adicionar Contato</Text>
      </Link>
    </View>
  );
}


