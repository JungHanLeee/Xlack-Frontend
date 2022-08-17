import React from 'react';
import {UserInformationTypes} from './types';
import styled from 'styled-components';

function User({id, user, github_id, bio, thumbnail_url, created_at, updated_at}: UserInformationTypes) {
    return (
        <UserContainer>
            user: {user},github_id: {github_id}
        </UserContainer>
    );
}

export default User;

const UserContainer = styled.div`
    color: purple;
    display: flex;
    border-bottom: 1px solid #49274b;
`;
