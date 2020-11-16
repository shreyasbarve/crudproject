// core
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  Header,
  Body,
  Title,
  Left,
  Button,
  Icon,
  Content,
  Right,
  Spinner,
  Text,
} from "native-base";
import React, { useState, useEffect } from "react";
import { BackHandler, TouchableOpacity } from "react-native";

// components
import MyCard from "../../components/MyCard";

// API
import TeacherApi from "../../models/teacher/TeacherApi";

export default function Dashboard({ route }) {
  // route data
  const tmail = route.params?.tmail ?? "";
  const tkey = route.params?.tkey ?? "";
  const tname = route.params?.tname ?? "";
  const tphone = route.params?.tphone ?? "";
  const imail = route.params?.imail ?? "";

  // navigation
  const navigation = useNavigation();

  // if get all classes display
  const [loading, setLoading] = useState(true);

  // teacher data
  var teacherData = {
    email: tmail,
    name: tname,
    user: "teacher", // user should be teacher
  };

  // get all classes
  const [allClass, setAllClass] = useState([]);
  const loadClasses = async () => {
    try {
      const res = await TeacherApi.getClasses(teacherData);
      setAllClass(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // add class
  const [addClass, setAddClass] = useState({
    teacher_email: "teachermail", // from login
    standard: "",
    section: "",
    subject: "",
    key: "teacherkey", // from login
  });
  const createClass = async () => {
    // try {
    //   await TeacherApi.createClass(addClass);
    //   loadClasses();
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // if harware back button pressed
  const handleBack = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    // loadClasses();
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Container>
          <Spinner color="blue" />
          <Button onPress={() => navigation.navigate("tclass")}>
            <Text>InClass</Text>
          </Button>
        </Container>
      ) : (
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name="ios-exit" />
              </Button>
            </Left>
            <Body>
              <Title>Dashboard</Title>
            </Body>
            <Right>
              <Button transparent hasText onPress={createClass}>
                <Text>Add Class</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <TouchableOpacity onPress={() => navigation.navigate("tclass")}>
              {allClass.map((classData) => (
                <TouchableOpacity
                  key={classData.classroom_id}
                  onPress={() =>
                    navigation.navigate("InClass", {
                      classId: classData.classroom_id,
                    })
                  }
                >
                  <MyCard
                    key={classData.classroom_id}
                    id={classData.classroom_id}
                    std={classData.standard}
                    section={classData.section}
                    subject={classData.subject}
                    students={classData.strength}
                  />
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          </Content>
        </Container>
      )}
    </>
  );
}
