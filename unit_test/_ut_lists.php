<?php
use PHPUnit\Framework\TestCase;

class ListsTest extends Lists
{
    public function tests()
    {
        $this->assertSame('[json]', count(getUserLists()));
        $this->assertSame('[json]', count(getUserShareLists()));
        $this->assertSame('success', count(onShareList()));
        $this->assertSame('error', count(onShareList()));
        $this->assertSame('', count(onCreateNewList()));
        $this->assertSame('', count(onDeleteUserList()));
        $this->assertSame('[json]', count(getListTasks()));
        $this->assertSame('', count(onCreateListTask()));
        $this->assertSame('', count(onDeleteListTask()));
        $this->assertSame('', count(onMarkTaskAsDone()));
        $this->assertSame('', count(onDoneAllTask()));
        $this->assertSame('', count(onDeleteAllDoneTask()));
        $this->assertSame('MichMich', count(getUserPseudo(1)));
        $this->assertSame('0', count(checkUserIsListOwner(1)));
        $this->assertSame('1', count(checkUserIsListOwner(1)));
        $this->assertSame('0', count(checkUserListPerms(1)));
        $this->assertSame('1', count(checkUserListPerms(1)));
    }
}

?>