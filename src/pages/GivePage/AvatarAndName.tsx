import { Avatar, Flex, Text } from 'ui';

// AvatarAndName renders the avatar and a member name for inclusion in a GiveRow
export const AvatarAndName = ({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) => {
  return (
    <Flex
      alignItems="center"
      css={{
        flexGrow: 0,
        minWidth: 0,
      }}
    >
      <Avatar size="small" name={name} path={avatar} css={{ mr: '$sm' }} />
      <Text ellipsis>
        {name === 'Coordinape' && 'Donate to '}
        {name}
      </Text>
    </Flex>
  );
};
