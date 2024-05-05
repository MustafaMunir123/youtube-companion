export type UpdateUsreRole = {
  role: string;
};

export type RolesData = {
  title: string;
  description: string;
  role: string;
};

export type UpdateUserModalProps = {
  lng: string;
  openModal: boolean;
  selectedUserData: any;
  handleOnClose: () => void;
};
