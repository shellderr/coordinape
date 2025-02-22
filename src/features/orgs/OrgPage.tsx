import React from 'react';

import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { NavLink, useParams } from 'react-router-dom';

import { ActivityList } from '../activities/ActivityList';
import { RecentActivityTitle } from '../activities/RecentActivityTitle';
import { LoadingModal } from 'components';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Avatar, Box, Button, ContentHeader, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData, QUERY_KEY_ORG_DATA } from './getOrgData';
import { OrgBanner } from './OrgBanner';

import type { Awaited } from 'types/shim';

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

export const OrgPage = () => {
  const orgId = Number.parseInt(useParams().orgId ?? '-1');
  const navigate = useNavigate();
  const address = useConnectedAddress();
  const query = useQuery(
    [QUERY_KEY_ORG_DATA, orgId],
    () => getOrgData(orgId, address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );
  const org = query.data?.organizations_by_pk;

  if (query.isLoading || query.isIdle || query.isRefetching)
    return <LoadingModal visible note="OrganizationPage" />;

  if (!org) {
    navigate(paths.home);
    return <></>;
  }

  const isAdmin = (org: Required<QueryResult>['organizations_by_pk']) =>
    org.circles.map(c => c.users[0]).some(u => u && isUserAdmin(u));

  return (
    <SingleColumnLayout>
      <Box key={org.id} css={{ mb: '$lg' }}>
        <ContentHeader>
          <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
            <Text h1 css={{ gap: '$sm' }}>
              <Avatar path={org.logo} size="small" name={org.name || ''} />
              {org.name || ''}
            </Text>
          </Flex>
          {isAdmin(org) && (
            <Flex css={{ gap: '$sm' }}>
              <Button
                as={NavLink}
                to={paths.organizationSettings(orgId)}
                color="primary"
              >
                Settings
              </Button>
              <Button
                as={NavLink}
                to={paths.createCircle + '?org=' + org.id}
                color="cta"
              >
                Add Circle
              </Button>
            </Flex>
          )}
        </ContentHeader>
        <OrgBanner orgId={org.id} />
        <Box css={{ mt: '$lg' }}>
          <RecentActivityTitle />
          <ActivityList
            queryKey={['org-activities', org.id]}
            where={{ organization_id: { _eq: org.id } }}
          />
        </Box>
      </Box>
    </SingleColumnLayout>
  );
};
