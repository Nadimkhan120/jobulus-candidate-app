import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import {
  AddPaymentCard,
  AddRole,
  AddUser,
  ChangePassword,
  CompanyDetail,
  EditCompany,
  JdLibrary,
  JdLibraryDetail,
  JobDescription,
  JobPosted,
  LoginAndSecurity,
  MyAccount,
  MyPayments,
  PaymentMethods,
  Payments,
  PersonalInformation,
  Postjob,
  PostJobDetail,
  PostJobPayment,
  PostJobPreview,
  Roles,
  Users,
  UserSettings,
  RecruitmentProcess,
  AddProcess,
  Steps,
  AddStep,
  AddCompany,
  MyContacts,
  MyJobs,
  MyCompanies,
  Search,
  EditProfile,
  AddProfile,
  MyJobDetail,
  ChatList,
  Chats,
  AddEducation,
  AddExperience,
  ChooseCompany,
  ChooseSkills,
  ChooseDegree,
  Notifications,
  Profile,
  ChooseLocation,
  ChooseDegreeField,
  ChooseSchool,
} from '@/screens';
import Applicants from '@/screens/applicants';
import CandidateProfile from '@/screens/candidate-profile';
import { Job } from '@/screens/job';
import JobDetail from '@/screens/job-detail';
import { TabNavigator } from './tab-navigator';

export type AppStackParamList = {
  TabNavigator: undefined;
  Details: { id: number };
  Job: { id: string };
  Payments: undefined;
  Applicants: { id: any };
  jobDetail: { id: null };
  CandidateProfile: { data: any };
  PaymentMethods: undefined;
  MyPayments: undefined;
  AddPaymentCard: undefined;
  Postjob: undefined;
  PostJobDetail: undefined;
  PostJobPreview: undefined;
  PostJobPayment: undefined;
  JobPosted: undefined;
  JdLibrary: undefined;
  JdLibraryDetail: undefined;
  MyAccount: undefined;
  ChangePassword: undefined;
  PersonalInformation: undefined;
  LoginAndSecurity: undefined;
  CompanyDetail: undefined;
  EditCompany: { data: any };
  UserSettings: undefined;
  Users: undefined;
  AddUser: undefined;
  Roles: undefined;
  AddRole: undefined;
  JobDescription: undefined;
  RecruitmentProcess: undefined;
  AddProcess: undefined;
  Steps: { id: number };
  AddStep: { processId: number; stepsCount: number };
  AddCompany: undefined;
  MyContacts: undefined;
  MyJobs: undefined;
  MyCompanies: undefined;
  Search: undefined;
  EditProfile: undefined;
  AddProfile: undefined;
  MyJobDetail: undefined;
  ChatList: undefined;
  Chats: undefined;
  AddEducation: undefined;
  AddExperience: undefined;
  ChooseCompany: undefined;
  ChooseSkills: undefined;
  ChooseDegree: undefined;
  Notifications: undefined;
  Profile: undefined;
  ChooseLocation: undefined;
  ChooseDegreeField: undefined;
  ChooseSchool: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="Job" component={Job} />
        <Stack.Screen name="jobDetail" component={JobDetail} />
        <Stack.Screen name="Applicants" component={Applicants} />
        <Stack.Screen name="CandidateProfile" component={CandidateProfile} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="AddPaymentCard" component={AddPaymentCard} />
        <Stack.Screen name="MyPayments" component={MyPayments} />
        <Stack.Screen name="Postjob" component={Postjob} />
        <Stack.Screen name="PostJobDetail" component={PostJobDetail} />
        <Stack.Screen name="PostJobPayment" component={PostJobPayment} />
        <Stack.Screen name="PostJobPreview" component={PostJobPreview} />
        <Stack.Screen name="JobPosted" component={JobPosted} />
        <Stack.Screen name="JdLibrary" component={JdLibrary} />
        <Stack.Screen name="JdLibraryDetail" component={JdLibraryDetail} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformation}
        />
        <Stack.Screen name="LoginAndSecurity" component={LoginAndSecurity} />
        <Stack.Screen name="CompanyDetail" component={CompanyDetail} />
        <Stack.Screen name="EditCompany" component={EditCompany} />
        <Stack.Screen name="UserSettings" component={UserSettings} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="Roles" component={Roles} />
        <Stack.Screen name="AddRole" component={AddRole} />
        <Stack.Screen name="JobDescription" component={JobDescription} />
        <Stack.Screen
          name="RecruitmentProcess"
          component={RecruitmentProcess}
        />
        <Stack.Screen name="AddProcess" component={AddProcess} />
        <Stack.Screen name="Steps" component={Steps} />
        <Stack.Screen name="AddStep" component={AddStep} />
        <Stack.Screen name="AddCompany" component={AddCompany} />

        <Stack.Screen name="MyContacts" component={MyContacts} />
        <Stack.Screen name="MyCompanies" component={MyCompanies} />
        <Stack.Screen name="MyJobs" component={MyJobs} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="AddProfile" component={AddProfile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="MyJobDetail" component={MyJobDetail} />

        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="AddEducation" component={AddEducation} />
        <Stack.Screen name="AddExperience" component={AddExperience} />
        <Stack.Screen name="ChooseCompany" component={ChooseCompany} />
        <Stack.Screen name="ChooseDegree" component={ChooseDegree} />
        <Stack.Screen name="ChooseSkills" component={ChooseSkills} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
        <Stack.Screen name="ChooseDegreeField" component={ChooseDegreeField} />
        <Stack.Screen name="ChooseSchool" component={ChooseSchool} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
