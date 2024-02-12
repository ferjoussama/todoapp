import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import LogoImage from '../assets/icons/logo_white.png';
import MenuIcon from '../assets/icons/menu.png';
import AddIcon from '../assets/icons/add-square.png';
import Sortmenu from '../assets/icons/Sortmenu.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '../components/ToDo/Task';
import Statbox from '../components/Statistics/Statbox';
import AddTodoModal from '../components/Modals/AddTodoModal';
import SortTodoModal from '../components/Modals/SortTodoModal';
import UpdateTodoModal from '../components/Modals/UpdateTodoModal';

const TodoList = ({navigation}) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUsername] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [statboxKey, setStatboxKey] = useState(0);

  const RadioButtonPress = value => {
    setSelectedOption(value);
  };

  const addTodo = async () => {
    if (title.trim() !== '' && description.trim() !== '') {
      setLoading(true);
      const newTodo = {
        title,
        description,
        status: 'Pending',
      };
      const userToken = await AsyncStorage.getItem('userToken');
      try {
        const response = await fetch(`${process.env.ENDPOINT_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          const responseData = await response.json();
          setTodos([...todos, responseData.data]);
          setUsername(responseData.user_name);
          setTitle('');
          setDescription('');
          setModalVisible(false);
        } else {
          console.error(
            'Failed to add task:',
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Error adding task:', error.message);
      } finally {
        setStatboxKey(prevKey => prevKey + 1);
        setLoading(false);
      }
    }
  };

  const renderTodoItemTask = ({item}) => (
    <TouchableOpacity onPress={() => openUpdateModal(item)}>
      <Task item={item} username={username} />
    </TouchableOpacity>
  );

  const fetchTodos = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      setLoadingTodos(true);
      const response = await fetch(`${process.env.ENDPOINT_URL}/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();

        setUsername(responseData.user_name);
        if (responseData.data != undefined) {
          setTodos(responseData.data);
        }
      } else {
        console.error(
          'Failed to fetch tasks:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoadingTodos(false);
    }
  };

  const openUpdateModal = todo => {
    setSelectedTodo(todo);
    setUpdatedTitle(todo.title);
    setUpdatedDescription(todo.description);
    setUpdateModalVisible(true);
  };

  const updateTodo = async () => {
    if (selectedTodo) {
      let state =
        selectedTodo.status == 'COMPLETED'
          ? 'COMPLETED'
          : isTaskCompleted
          ? 'COMPLETED'
          : 'IN PROGRESS';
      const updatedTodo = {
        ...selectedTodo,
        title: updatedTitle,
        description: updatedDescription,
        status: state,
      };

      const userToken = await AsyncStorage.getItem('userToken');
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.ENDPOINT_URL}/tasks/${selectedTodo.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(updatedTodo),
          },
        );

        if (response.ok) {
          const updatedTodos = todos.map(item =>
            item.id === selectedTodo.id ? updatedTodo : item,
          );
          setTodos(updatedTodos);
          setUpdateModalVisible(false);
        } else {
          console.error(
            'Failed to update task:',
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Error updating task:', error.message);
      } finally {
        setLoading(false);
        setStatboxKey(prevKey => prevKey + 1);
      }
    }
  };

  const deleteTodo = async () => {
    if (selectedTodo) {
      const userToken = await AsyncStorage.getItem('userToken');
      try {
        const response = await fetch(
          `${process.env.ENDPOINT_URL}/tasks/${selectedTodo.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        if (response.ok) {
          const updatedTodos = todos.filter(
            item => item.id !== selectedTodo.id,
          );
          setTodos(updatedTodos);
          setUpdateModalVisible(false);
        } else {
          console.error(
            'Failed to delete task:',
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Error deleting task:', error.message);
      } finally {
        setStatboxKey(prevKey => prevKey + 1);
      }
    }
  };

  const confirmSort = () => {
    let sortedTodos;
    if (selectedOption === 'Name') {
      sortedTodos = [...todos].sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
    } else if (selectedOption === 'Status') {
      sortedTodos = [...todos].sort((a, b) => {
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return -1;
        if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return 1;
        return 0;
      });
    } else {
      sortedTodos = [...todos];
    }

    setTodos(sortedTodos);
    setSortModalVisible(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <View>
        <View style={styles.containerheader}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={MenuIcon}></Image>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={LogoImage} style={styles.logo} />
          </View>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setModalVisible(true)}
          >
            <Image source={AddIcon}></Image>
          </TouchableOpacity>

          <View style={styles.header}></View>
        </View>
        <Statbox key={statboxKey} />
      </View>

      <View style={styles.containerToDo}>
        <View style={styles.sort}>
          <Text style={styles.text}>Due today</Text>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setSortModalVisible(true)}
          >
            <Text>Sort By</Text>
            <Image source={Sortmenu}></Image>
          </TouchableOpacity>
        </View>
        {loadingTodos ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={todos}
            keyExtractor={item => item.id}
            renderItem={renderTodoItemTask}
          />
        )}
      </View>

      <AddTodoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addTodo={addTodo}
        loading={loading}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <SortTodoModal
        sortModalVisible={sortModalVisible}
        setSortModalVisible={setSortModalVisible}
        confirmSort={confirmSort}
        RadioButtonPress={RadioButtonPress}
        selectedOption={selectedOption}
        loading={loading}
      />

      {selectedTodo !== null && (
        <UpdateTodoModal
          updateModalVisible={updateModalVisible}
          setUpdateModalVisible={setUpdateModalVisible}
          selectedTodo={selectedTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          loading={loading}
          updatedTitle={updatedTitle}
          setUpdatedTitle={setUpdatedTitle}
          updatedDescription={updatedDescription}
          setUpdatedDescription={setUpdatedDescription}
          isTaskCompleted={isTaskCompleted}
          setIsTaskCompleted={setIsTaskCompleted}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
  },

  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  containerheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
    height: 150,
  },
  header: {
    backgroundColor: '#023AE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 350,
    width: '200%',
    height: 800,
    marginLeft: -200,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 18,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  logo: {
    width: 50,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    zIndex: 1,
  },
  containerToDo: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  sort: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default TodoList;
