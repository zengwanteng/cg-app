<template>
    <div class="application-container">
        <!-- vue-router它有三个全局组件：router-view、router-link、keep-alive(几乎不会怎么使用，面试的时候人家会问，因为他想考察大家的知识面) -->
        <!-- <router-view></router-view> -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>