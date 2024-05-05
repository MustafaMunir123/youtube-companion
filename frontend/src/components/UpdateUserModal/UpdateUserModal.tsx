'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { orgInfo } from '@/atoms/auth.atom';
import { useFetchRoles } from '@/services/manageUsers/manageUsers.service';
import { useUpdateUser } from '@/services/manageUsers/manageUsers.service';
import { Avatar } from '@/ui-components';
import { Button } from '@/ui-components';
import { CustomModal } from '@/ui-components/CustomModal/CustomModal';
import { RadioInput } from '@/ui-components/RadioInput/RadioInput';
import { INIVTE_USER_ROLE_KEY, StatusCodes } from '@/utils/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'flowbite-react';
import { useAtomValue } from 'jotai';

import { updateUserSchema } from './UpdateUserModal.schema';
import { RolesData, UpdateUserModalProps, UpdateUsreRole } from './UpdateUserModal.types';

import { useI18n } from '@/i18n/client';

export function UpdateUserModal({
  openModal,
  selectedUserData,
  handleOnClose: onClose,
  lng,
}: UpdateUserModalProps) {
  const t = useI18n();
  const organizationInfo = useAtomValue(orgInfo);
  const { data: rolesData } = useFetchRoles();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UpdateUsreRole>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      role: '',
    },
  });

  const updateUser = useUpdateUser();

  const onInviteSubmit: SubmitHandler<UpdateUsreRole> = async () => {
    setIsLoading(true);
    const payload = {
      data: {
        role: getValues('role'),
        id: selectedUserData?.id,
      },
    };
    try {
      const response = await updateUser.mutateAsync(payload);
      if (response.status_code === StatusCodes.SUCCESS) {
        toast.success(t('user_updated_successfully'));
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(t('not_found_error'));
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <CustomModal
        show={openModal}
        onClose={onClose}
        text={t('invite_user')}
        title={t('invite_user')}
      >
        <Modal.Header>{t('update_user_access')}</Modal.Header>
        <form onSubmit={handleSubmit(onInviteSubmit)}>
          <Modal.Body>
            <div className="flex gap-x-2 gap-y-2 items-center pb-4 border-b border-gray-200">
              <Avatar />
              <div className="flex flex-col">
                <h5 className="text-lg font-semibold">{selectedUserData?.name}</h5>
                <p className="text-sm text-gray-500">{selectedUserData?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-4">
              <label className="text-neutral-800 font-semibold text-sm capitalize tracking-wide">
                {t('assign_role')} <span className="text-danger-500">*</span>
              </label>
              <div className="flex flex-col gap-y-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                {rolesData?.data.map((roleData: RolesData, index: number) => {
                  return (
                    <div key={index}>
                      <RadioInput
                        name={INIVTE_USER_ROLE_KEY}
                        value={roleData.role}
                        radioLabel={roleData.title}
                        defaultChecked={roleData.role === selectedUserData?.role}
                        radioDescription={roleData.description}
                        onChange={(e) => {
                          setValue('role', e.target.value);
                        }}
                        required
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={isLoading} onClick={onClose} size="md">
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} size="md">
              {t('update')}
            </Button>
          </Modal.Footer>
        </form>
      </CustomModal>
    </>
  );
}
