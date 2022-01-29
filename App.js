import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const COLORS = {primary: '#e63946', white: '#fff'};

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getTodosFromDevices();
  }, []);
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);
  //
  //delete item
  const deleted = todoId => {
    const newToDos = todos.filter(item => item.id !== todoId);
    setTodos(newToDos);
  };
  //
  //clear all list items
  const clearAll = () => {
    console.log(typeof todos);
    if (todos === {}) {
      Alert.alert('không có tác vụ');
    } else {
      Alert.alert('Cảnh báo!!', 'Bạn có chắc muốn xóa tất cả task?', [
        {
          text: 'Xóa',
          onPress: () => setTodos([]),
        },
        {
          text: 'Hủy',
        },
      ]);
    }
  };
  //
  //selected items on list
  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: '#333',
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            style={styles.activeIcon}
            onPress={() => markTodoCompleted(todo.id)}>
            <Icon name="check" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.activeIcon, {backgroundColor: 'red'}]}
          onPress={() => deleted(todo?.id)}>
          <Icon name="trash" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };
  //
  //add todo
  const addToDo = () => {
    if (textInput === '') {
      Alert.alert('Cảnh báo!', 'Vui lòng nhập text!');
    } else {
      const newToDo = {
        id: Math.random(),
        task: textInput,
        delete: false,
      };
      setTodos([...todos, newToDo]);
      setTextInput('');
    }
  };
  //
  //check completed todo
  const markTodoCompleted = todoId => {
    console.log(todoId);
    const newToDoIds = todos.map(item => {
      if (item.id === todoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newToDoIds);
  };
  //
  //get data saved from device
  const getTodosFromDevices = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos !== null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  //
  //Save todo app
  const saveTodos = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };
  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Lập kế hoạch cần làm</Text>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => clearAll()}>
          <Text
            style={{
              marginRight: 10,
              fontSize: 14,
              color: '#faedcd',
            }}>
            Xóa tất cả
          </Text>
          <Icon name="trash" color="red" size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={todos}
        contentContainerStyle={{pading: 20, paddingBottom: 100}}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Add Todo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addToDo}>
          <View style={styles.iconContainer}>
            <Icon name="plus" size={25} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  activeIcon: {
    marginLeft: 10,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06d6a0',
    borderRadius: 5,
  },
  view: {
    backgroundColor: '#001d3d',
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#faedcd',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: COLORS.white,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: '#e3f2fd',
    borderRadius: 24,
    paddingLeft: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    elevation: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
  },
  listItem: {
    padding: 12,
    marginHorizontal: 15,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 20,
    height: 50,
    borderRadius: 7,
    marginVertical: 10,
  },
});
